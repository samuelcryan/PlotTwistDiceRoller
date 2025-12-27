import { useState, useEffect } from 'react';
import type { Roll, BonusModifier, PendingRoll } from './types';
import { TROPE_DESCRIPTIONS } from './data/descriptions';
import {
  rollDie,
  getRandomTrope,
  generateId,
  generateBonusModifier,
  formatEffectDescription,
  getStoryDate,
  formatCharges,
  handleReroll
} from './utils/helpers';
import { calculateRefund } from './utils/refundCalculator';
import { saveGameState, loadGameState } from './utils/storage';
import './App.css';

function App() {
  // State management
  const [daysSinceTrigger, setDaysSinceTrigger] = useState(0);
  const [currentCharges, setCurrentCharges] = useState(5.0);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [bankedRolls, setBankedRolls] = useState<Roll[]>([]);
  const [bonusModifier, setBonusModifier] = useState<BonusModifier | null>(null);
  const [pendingRoll, setPendingRoll] = useState<PendingRoll | null>(null);
  const [activeCategories, setActiveCategories] = useState<{ [key: string]: boolean }>({
    "Extreme Combat": true,
    "Combat": true,
    "Social": true,
    "Isolated": true,
    "Companion": true,
    "Fanservice": true,
    "Wildcard": true
  });
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [username] = useState('Player');

  // Auto-dissipate banked tropes after 3 days
  useEffect(() => {
    const toDissipate = bankedRolls.filter(roll => daysSinceTrigger - (roll.bankDay || 0) >= 3);
    if (toDissipate.length > 0) {
      toDissipate.forEach(roll => {
        const refund = calculateRefund(roll.intensity, roll.longevity);
        setCurrentCharges(prev => Math.min(5, prev + refund));
      });
      setBankedRolls(prev => prev.filter(roll => daysSinceTrigger - (roll.bankDay || 0) < 3));
    }
  }, [daysSinceTrigger, bankedRolls]);

  // Calculate available and locked charges
  const lockedCharges = bankedRolls.length;
  const availableCharges = Math.max(0, currentCharges - lockedCharges);

  // Advance day
  const advanceDay = () => {
    setDaysSinceTrigger(prev => prev + 1);
    setCurrentCharges(prev => Math.min(5, prev + 1)); // +1 charge per day
  };

  // Add battle charge
  const addBattleCharge = () => {
    setCurrentCharges(prev => Math.min(5, prev + 1));
  };

  // Pull new trope
  const pullNewTrope = () => {
    if (availableCharges < 1) {
      alert('Not enough available charges! You need at least 1 charge to pull a trope.');
      return;
    }

    // Consume 1 charge
    setCurrentCharges(prev => prev - 1);

    // Roll 2d20
    let die1 = rollDie();
    let die2 = rollDie();
    let die1Original: number | undefined;
    let die2Original: number | undefined;
    let rerolledFrom20 = false;

    // Check for Natural 20s
    if (die1 === 20 || die2 === 20) {
      // Generate bonus modifier
      const newBonus = generateBonusModifier(daysSinceTrigger);

      // Warn if bonus already exists
      if (bonusModifier) {
        const confirmed = window.confirm(
          `You already have a bonus modifier (${bonusModifier.name})! Rolling this Natural 20 will overwrite it. Continue?`
        );
        if (!confirmed) {
          setCurrentCharges(prev => prev + 1); // Refund the charge
          return;
        }
      }

      setBonusModifier(newBonus);
      alert(`🎉 Natural 20! Bonus Modifier Earned: ${newBonus.name}\n\n${newBonus.description}\n\nThe 20 has been rerolled to 19 for this trope.`);

      // Reroll 20s to 19
      if (die1 === 20) {
        die1Original = 20;
        die1 = 19;
      }
      if (die2 === 20) {
        die2Original = 20;
        die2 = 19;
      }
      rerolledFrom20 = true;
    }

    // Get random trope
    try {
      const { trope, category } = getRandomTrope(activeCategories);
      const description = TROPE_DESCRIPTIONS[trope] || 'No description available.';

      // Create pending roll
      const pending: PendingRoll = {
        id: generateId(),
        trope,
        category,
        description,
        die1,
        die2,
        die1Original,
        die2Original,
        dayApplied: daysSinceTrigger,
        rerolledFrom20
      };

      setPendingRoll(pending);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to pull trope');
      setCurrentCharges(prev => prev + 1); // Refund the charge
    }
  };

  // Handle FAIL button
  const handleFail = () => {
    setCurrentCharges(prev => prev + 1); // Full refund
    setPendingRoll(null);
  };

  // Handle BANK button
  const handleBank = (assignment: 'die1ToIntensity' | 'die2ToIntensity', target: string) => {
    if (!pendingRoll) return;
    if (bankedRolls.length >= 5) {
      alert('Bank is full! Maximum 5 banked tropes.');
      return;
    }

    const intensity = assignment === 'die1ToIntensity' ? pendingRoll.die1 : pendingRoll.die2;
    const longevity = assignment === 'die1ToIntensity' ? pendingRoll.die2 : pendingRoll.die1;

    const roll: Roll = {
      ...pendingRoll,
      intensity,
      longevity,
      expired: false,
      banked: true,
      bankDay: daysSinceTrigger,
      appliedTo: target
    };

    setBankedRolls(prev => [...prev, roll]);
    setPendingRoll(null);
  };

  // Handle APPLY button
  const handleApply = (assignment: 'die1ToIntensity' | 'die2ToIntensity', target: string) => {
    if (!pendingRoll) return;

    let die1 = pendingRoll.die1;
    let die2 = pendingRoll.die2;
    let die1Original = pendingRoll.die1Original;
    let die2Original = pendingRoll.die2Original;
    let rerolledFrom1 = false;

    // Handle Natural 1 rerolls
    if (die1 === 1) {
      die1Original = 1;
      die1 = handleReroll(rollDie());
      rerolledFrom1 = true;
    }
    if (die2 === 1) {
      die2Original = 1;
      die2 = handleReroll(rollDie());
      rerolledFrom1 = true;
    }

    const intensity = assignment === 'die1ToIntensity' ? die1 : die2;
    const longevity = assignment === 'die1ToIntensity' ? die2 : die1;

    const roll: Roll = {
      ...pendingRoll,
      die1,
      die2,
      die1Original,
      die2Original,
      intensity,
      longevity,
      expired: false,
      banked: false,
      appliedTo: target,
      rerolledFrom1
    };

    setRolls(prev => [...prev, roll]);
    setPendingRoll(null);
  };

  // Toggle category
  const toggleCategory = (category: string) => {
    setActiveCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  // Enable all categories
  const enableAllCategories = () => {
    const allEnabled: { [key: string]: boolean } = {};
    Object.keys(activeCategories).forEach(cat => {
      allEnabled[cat] = true;
    });
    setActiveCategories(allEnabled);
  };

  // Disable all categories
  const disableAllCategories = () => {
    const allDisabled: { [key: string]: boolean } = {};
    Object.keys(activeCategories).forEach(cat => {
      allDisabled[cat] = false;
    });
    setActiveCategories(allDisabled);
  };

  // Toggle expired status
  const toggleExpired = (rollId: number) => {
    setRolls(prev => prev.map(roll =>
      roll.id === rollId ? { ...roll, expired: !roll.expired } : roll
    ));
  };

  // Delete roll
  const deleteRoll = (rollId: number, fromBank = false) => {
    if (fromBank) {
      setBankedRolls(prev => prev.filter(r => r.id !== rollId));
    } else {
      setRolls(prev => prev.filter(r => r.id !== rollId));
    }
  };

  // Collect refund for expired trope
  const collectRefund = (rollId: number) => {
    const roll = rolls.find(r => r.id === rollId);
    if (!roll || !roll.expired) return;

    const refund = calculateRefund(roll.intensity, roll.longevity);
    setCurrentCharges(prev => Math.min(5, prev + refund));
    setRolls(prev => prev.filter(r => r.id !== rollId));
  };

  // Unbank trope
  const unbankTrope = (rollId: number) => {
    const roll = bankedRolls.find(r => r.id === rollId);
    if (!roll) return;

    setBankedRolls(prev => prev.filter(r => r.id !== rollId));
    setRolls(prev => [...prev, { ...roll, banked: false, bankDay: undefined }]);
  };

  // Save game
  const saveGame = () => {
    const gameState = {
      username,
      lastSaved: new Date().toISOString(),
      daysSinceTrigger,
      currentCharges,
      rolls,
      bankedRolls,
      bonusModifier,
      activeCategories
    };
    if (saveGameState(username, gameState)) {
      alert('Game saved successfully!');
    } else {
      alert('Failed to save game.');
    }
  };

  // Load game
  const loadGame = () => {
    const loadedState = loadGameState(username);
    if (loadedState) {
      setDaysSinceTrigger(loadedState.daysSinceTrigger);
      setCurrentCharges(loadedState.currentCharges);
      setRolls(loadedState.rolls);
      setBankedRolls(loadedState.bankedRolls);
      setBonusModifier(loadedState.bonusModifier);
      setActiveCategories(loadedState.activeCategories);
      alert(`Game loaded! Last saved: ${new Date(loadedState.lastSaved).toLocaleString()}`);
    } else {
      alert('No saved game found for this username.');
    }
  };

  const activeRolls = rolls.filter(r => !r.expired);
  const expiredRolls = rolls.filter(r => r.expired);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-4 border-purple-600">
          <h1 className="text-5xl font-bold text-purple-600 text-center mb-2">
            Plot Twist Trope Roller
          </h1>
          <p className="text-xl text-gray-600 text-center mb-2">
            Danny Hebert's Trump Power Simulator
          </p>
          <p className="text-sm text-gray-500 text-center">
            Roll 2d20 to generate random tropes with variable Intensity and Longevity
          </p>
        </div>

        {/* Timeline & Charges */}
        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Days Since Trigger</p>
              <p className="text-2xl font-bold text-purple-600">{daysSinceTrigger}</p>
              <p className="text-xs text-gray-500">{getStoryDate(daysSinceTrigger)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Charges</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCharges(availableCharges)} / 5
              </p>
              {lockedCharges > 0 && (
                <p className="text-xs text-amber-600">({lockedCharges} locked in bank)</p>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={advanceDay}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Advance Day (+1 Charge)
              </button>
              <button
                onClick={addBattleCharge}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Battle (+1 Charge)
              </button>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={pullNewTrope}
              disabled={availableCharges < 1}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Pull New Trope (1 Charge)
            </button>
            <div className="text-sm text-gray-600 space-x-4">
              <span>Active: {activeRolls.length}</span>
              <span>Banked: {bankedRolls.length}/5</span>
              <span>Expired: {expiredRolls.length}</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={saveGame}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Game
              </button>
              <button
                onClick={loadGame}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Load Game
              </button>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Active Categories</h3>
            <div className="space-x-2">
              <button
                onClick={enableAllCategories}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Enable All
              </button>
              <button
                onClick={disableAllCategories}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Disable All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(activeCategories).map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Pending Roll Workflow */}
        {pendingRoll && (
          <PendingRollComponent
            pendingRoll={pendingRoll}
            onFail={handleFail}
            onBank={handleBank}
            onApply={handleApply}
            formatEffectDescription={formatEffectDescription}
          />
        )}

        {/* Bonus Modifier Display */}
        {bonusModifier && (
          <div className="bg-yellow-50 rounded-lg shadow-lg p-4 border-4 border-yellow-400">
            <h3 className="text-xl font-bold text-yellow-800 mb-2">Current Bonus Modifier</h3>
            <div className="bg-white p-4 rounded border border-yellow-300">
              <p className="font-bold text-lg">{bonusModifier.name}</p>
              <p className="text-sm text-gray-600 mb-2">{bonusModifier.description}</p>
              <p className="text-xs text-gray-500">Earned on Day {bonusModifier.dayEarned}</p>
              <p className="text-sm text-amber-700 mt-2">
                ⚠️ Use this bonus before rolling your next trope
              </p>
              <p className="text-xs text-gray-500 mt-3">
                (Bonus modifier application feature coming soon)
              </p>
            </div>
          </div>
        )}

        {/* Banked Tropes */}
        {bankedRolls.length > 0 && (
          <div className="bg-amber-50 rounded-lg shadow-lg p-4 border-4 border-amber-500">
            <h3 className="text-xl font-bold text-amber-800 mb-4">Banked Tropes ({bankedRolls.length}/5)</h3>
            <div className="space-y-3">
              {bankedRolls.map(roll => {
                const daysRemaining = 3 - (daysSinceTrigger - (roll.bankDay || 0));
                return (
                  <div key={roll.id} className="bg-white p-4 rounded border-2 border-amber-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{roll.trope}</h4>
                        <p className="text-sm text-gray-600">{roll.category}</p>
                        <p className="text-sm text-amber-700">Days remaining: {daysRemaining}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => unbankTrope(roll.id)}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                        >
                          Unbank
                        </button>
                        <button
                          onClick={() => deleteRoll(roll.id, true)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active/Expired Tropes Tabs */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300">
          <div className="border-b border-gray-300">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 font-bold ${activeTab === 'active'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Active Tropes ({activeRolls.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`px-6 py-3 font-bold ${activeTab === 'expired'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Expired Tropes ({expiredRolls.length})
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {activeTab === 'active' && activeRolls.map(roll => (
              <TropeCard
                key={roll.id}
                roll={roll}
                onToggleExpired={toggleExpired}
                onDelete={deleteRoll}
                formatEffectDescription={formatEffectDescription}
              />
            ))}
            {activeTab === 'expired' && expiredRolls.map(roll => (
              <TropeCard
                key={roll.id}
                roll={roll}
                onToggleExpired={toggleExpired}
                onDelete={deleteRoll}
                onCollectRefund={collectRefund}
                formatEffectDescription={formatEffectDescription}
                showRefund
              />
            ))}
            {activeTab === 'active' && activeRolls.length === 0 && (
              <p className="text-gray-500 text-center py-8">No active tropes</p>
            )}
            {activeTab === 'expired' && expiredRolls.length === 0 && (
              <p className="text-gray-500 text-center py-8">No expired tropes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pending Roll Component
function PendingRollComponent({ pendingRoll, onFail, onBank, onApply, formatEffectDescription }: any) {
  const [assignment, setAssignment] = useState<'die1ToIntensity' | 'die2ToIntensity'>('die1ToIntensity');
  const [targetType, setTargetType] = useState('Danny');
  const [targetName, setTargetName] = useState('');

  const target = targetType === 'Danny' ? 'Danny' : targetName || targetType;

  return (
    <div className="bg-purple-50 rounded-lg shadow-lg p-6 border-4 border-purple-600">
      {(pendingRoll.die1Original === 20 || pendingRoll.die2Original === 20) && (
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded p-4 mb-4">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-lg text-yellow-800">Natural 20! Bonus Modifier Earned</p>
              <p className="text-sm text-gray-700">The 20 has been rerolled to 19 for this trope</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-2">{pendingRoll.trope}</h2>
      <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold mb-3">
        {pendingRoll.category}
      </span>
      <p className="text-gray-700 italic mb-4">{pendingRoll.description}</p>

      <p className="mb-4">
        <span className="font-semibold">Rolled: </span>
        {pendingRoll.die1Original === 20 ? (
          <><del>20</del> → 19</>
        ) : pendingRoll.die1Original === 1 ? (
          <><del>1</del> → {pendingRoll.die1}</>
        ) : (
          pendingRoll.die1
        )}
        {' & '}
        {pendingRoll.die2Original === 20 ? (
          <><del>20</del> → 19</>
        ) : pendingRoll.die2Original === 1 ? (
          <><del>1</del> → {pendingRoll.die2}</>
        ) : (
          pendingRoll.die2
        )}
      </p>

      {(pendingRoll.die1 === 1 || pendingRoll.die2 === 1) && (
        <div className="bg-amber-100 border border-amber-400 rounded p-3 mb-4">
          <p className="text-amber-800">⚠️ Natural 1 detected - Blind reroll will occur on APPLY</p>
        </div>
      )}

      <div className="space-y-3 mb-4">
        <p className="font-semibold">Assignment Options:</p>
        <button
          onClick={() => setAssignment('die1ToIntensity')}
          className={`w-full p-3 rounded border-2 ${assignment === 'die1ToIntensity'
              ? 'border-purple-600 bg-purple-100'
              : 'border-gray-300 bg-white'
            }`}
        >
          <div className="font-bold">
            Intensity: {pendingRoll.die1}{pendingRoll.die1Original === 20 && ' (was 20)'}
            {' | '}
            Longevity: {pendingRoll.die2}{pendingRoll.die2Original === 20 && ' (was 20)'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {formatEffectDescription(pendingRoll.die1, pendingRoll.die2)}
          </div>
        </button>
        <button
          onClick={() => setAssignment('die2ToIntensity')}
          className={`w-full p-3 rounded border-2 ${assignment === 'die2ToIntensity'
              ? 'border-purple-600 bg-purple-100'
              : 'border-gray-300 bg-white'
            }`}
        >
          <div className="font-bold">
            Intensity: {pendingRoll.die2}{pendingRoll.die2Original === 20 && ' (was 20)'}
            {' | '}
            Longevity: {pendingRoll.die1}{pendingRoll.die1Original === 20 && ' (was 20)'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {formatEffectDescription(pendingRoll.die2, pendingRoll.die1)}
          </div>
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Target:</label>
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Danny">Danny</option>
          <option value="Ally">Ally</option>
          <option value="Enemy">Enemy</option>
          <option value="Neutral">Neutral</option>
          <option value="Object">Object</option>
        </select>
        {targetType !== 'Danny' && (
          <input
            type="text"
            placeholder="Enter target name"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onFail}
          className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700"
        >
          FAIL
        </button>
        <button
          onClick={() => onBank(assignment, target)}
          disabled={false}
          className="flex-1 px-4 py-2 bg-amber-600 text-white font-bold rounded hover:bg-amber-700 disabled:bg-gray-400"
        >
          BANK
        </button>
        <button
          onClick={() => onApply(assignment, target)}
          className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
        >
          APPLY
        </button>
      </div>
    </div>
  );
}

// Trope Card Component
function TropeCard({ roll, onToggleExpired, onDelete, onCollectRefund, formatEffectDescription, showRefund }: any) {
  const refund = showRefund ? calculateRefund(roll.intensity, roll.longevity) : 0;

  return (
    <div className={`rounded-lg p-4 border-4 ${roll.expired ? 'border-gray-400 bg-gray-50' : 'border-purple-600 bg-purple-50'
      }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">
            {roll.category}
          </span>
          <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">
            {roll.appliedTo}
          </span>
          {roll.rerolledFrom20 && (
            <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
              Bonus Earned
            </span>
          )}
          {roll.rerolledFrom1 && (
            <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm">
              Blind Reroll
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleExpired(roll.id)}
            className={`px-3 py-1 text-sm rounded ${roll.expired
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
          >
            {roll.expired ? 'Restore' : 'Expire'}
          </button>
          <button
            onClick={() => onDelete(roll.id)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">{roll.trope}</h3>
      <p className="text-gray-700 italic mb-3">{TROPE_DESCRIPTIONS[roll.trope]}</p>

      <div className="bg-white border-2 border-purple-300 rounded p-3 mb-3">
        <p className="font-semibold text-purple-800">
          {formatEffectDescription(roll.intensity, roll.longevity)}
        </p>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          Rolled: {roll.die1Original === 20 || roll.die1Original === 1 ? (
            <><del>{roll.die1Original}</del> → {roll.die1}</>
          ) : roll.die1}
          {' & '}
          {roll.die2Original === 20 || roll.die2Original === 1 ? (
            <><del>{roll.die2Original}</del> → {roll.die2}</>
          ) : roll.die2}
          {(roll.rerolledFrom20 || roll.rerolledFrom1) && (
            <span className="ml-2 text-purple-600">
              ({roll.rerolledFrom20 ? 'Bonus Earned' : 'Blind Reroll'})
            </span>
          )}
        </p>
        <p>Applied on Day {roll.dayApplied}</p>
      </div>

      {showRefund && (
        <div className="mt-3 bg-green-100 border border-green-400 rounded p-3">
          <p className="text-sm font-semibold text-green-800">
            Energy Refund: {formatCharges(refund)} charges
          </p>
          <button
            onClick={() => onCollectRefund(roll.id)}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Collect Refund
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
