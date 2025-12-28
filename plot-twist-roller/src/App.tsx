import { useState } from 'react';
import type { Roll, BonusModifier, PendingRoll } from './types';
import { TROPE_DESCRIPTIONS } from './data/tropes';
import {
  rollDie,
  getRandomTrope,
  generateId,
  generateBonusModifier,
  formatEffectDescription,
  formatCharges,
  handleReroll
} from './utils/helpers';
import { calculateRefund } from './utils/refundCalculator';
import { saveGameState, loadGameState } from './utils/storage';
import './App.css';

function App() {
  // State management
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

  // Calculate available and locked charges
  const lockedCharges = bankedRolls.length;
  const availableCharges = Math.max(0, currentCharges - lockedCharges);

  // Add charge (up to max 5)
  const addCharge = () => {
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
      const newBonus = generateBonusModifier(0);

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
        dayApplied: 0,
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

  // Unbank trope - convert back to pending roll to allow target selection
  const unbankTrope = (rollId: number) => {
    const roll = bankedRolls.find(r => r.id === rollId);
    if (!roll) return;

    // Convert the banked roll back to a pending roll
    const pending: PendingRoll = {
      id: roll.id,
      trope: roll.trope,
      category: roll.category,
      description: TROPE_DESCRIPTIONS[roll.trope] || 'No description available.',
      die1: roll.die1,
      die2: roll.die2,
      die1Original: roll.die1Original,
      die2Original: roll.die2Original,
      dayApplied: roll.dayApplied,
      rerolledFrom20: roll.rerolledFrom20
    };

    setBankedRolls(prev => prev.filter(r => r.id !== rollId));
    setPendingRoll(pending);
  };

  // Apply bonus modifier to a trope
  const applyBonusModifier = (rollId: number, applyTo: 'intensity' | 'longevity' | 'auto') => {
    if (!bonusModifier) return;

    setRolls(prev => prev.map(roll => {
      if (roll.id === rollId) {
        let updatedRoll = { ...roll, bonusApplied: true };
        let message = '';

        switch (bonusModifier.type) {
          case 'permanent':
            // Set longevity to 20 (true permanent)
            updatedRoll.longevity = 20;
            message = 'Trope is now permanent! Longevity set to 20.';
            break;

          case 'plus3':
            // Add +3 to selected stat (max 19)
            if (applyTo === 'intensity') {
              updatedRoll.intensity = Math.min(19, roll.intensity + 3);
              message = `Intensity increased by 3 to ${updatedRoll.intensity}.`;
            } else {
              updatedRoll.longevity = Math.min(20, roll.longevity + 3);
              message = `Longevity increased by 3 to ${updatedRoll.longevity}.`;
            }
            break;

          case 'minus5':
            // Subtract 5 from selected stat (min 2)
            if (applyTo === 'intensity') {
              updatedRoll.intensity = Math.max(2, roll.intensity - 5);
              message = `Intensity decreased by 5 to ${updatedRoll.intensity}.`;
            } else {
              updatedRoll.longevity = Math.max(2, roll.longevity - 5);
              message = `Longevity decreased by 5 to ${updatedRoll.longevity}.`;
            }
            break;

          case 'reroll':
            // Reroll the selected die (intensity or longevity)
            const newRoll = rollDie();
            if (applyTo === 'intensity') {
              // Figure out which original die was used for intensity
              const wasUsingDie1 = roll.intensity === roll.die1;
              if (wasUsingDie1) {
                updatedRoll.die1 = newRoll;
                updatedRoll.intensity = newRoll;
              } else {
                updatedRoll.die2 = newRoll;
                updatedRoll.intensity = newRoll;
              }
              message = `Intensity die rerolled! New value: ${newRoll}.`;
            } else {
              // Figure out which original die was used for longevity
              const wasUsingDie1 = roll.longevity === roll.die1;
              if (wasUsingDie1) {
                updatedRoll.die1 = newRoll;
                updatedRoll.longevity = newRoll;
              } else {
                updatedRoll.die2 = newRoll;
                updatedRoll.longevity = newRoll;
              }
              message = `Longevity die rerolled! New value: ${newRoll}.`;
            }
            break;

          case 'swap':
            // Swap intensity and longevity
            updatedRoll.intensity = roll.longevity;
            updatedRoll.longevity = roll.intensity;
            message = `Intensity and Longevity swapped! Now Int: ${updatedRoll.intensity}, Long: ${updatedRoll.longevity}.`;
            break;

          case 'refresh':
            // Reset longevity to original die value
            const originalLongevity = roll.intensity === roll.die1 ? roll.die2 : roll.die1;
            updatedRoll.longevity = originalLongevity;
            message = `Duration refreshed! Longevity reset to ${updatedRoll.longevity}.`;
            break;

          case 'expire':
            // Mark the trope as expired
            updatedRoll.expired = true;
            message = 'Trope has been marked as expired.';
            break;

          case 'retarget':
            // This needs special UI to change the target - for now just show a message
            const newTarget = prompt('Enter new target name:', roll.appliedTo);
            if (newTarget && newTarget.trim()) {
              updatedRoll.appliedTo = newTarget.trim();
              message = `Target changed to: ${newTarget.trim()}.`;
            } else {
              return roll; // No change if cancelled
            }
            break;

          default:
            // Generic +1 for unknown types
            if (applyTo === 'intensity') {
              updatedRoll.intensity = Math.min(20, roll.intensity + 1);
              message = `Intensity increased by 1 to ${updatedRoll.intensity}.`;
            } else {
              updatedRoll.longevity = Math.min(20, roll.longevity + 1);
              message = `Longevity increased by 1 to ${updatedRoll.longevity}.`;
            }
        }

        alert(`Bonus modifier applied! ${message}`);
        return updatedRoll;
      }
      return roll;
    }));

    // Clear the bonus modifier after use
    setBonusModifier(null);
  };

  // Save game
  const saveGame = () => {
    const gameState = {
      username,
      lastSaved: new Date().toISOString(),
      daysSinceTrigger: 0,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 px-4">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-2xl p-8 text-white">
          <h1 className="text-6xl font-bold text-center mb-3 drop-shadow-lg">
            Plot Twist Trope Roller
          </h1>
          <p className="text-2xl text-center mb-2 text-purple-100">
            Danny Hebert's Trump Power Simulator
          </p>
          <p className="text-sm text-center text-purple-200">
            Roll 2d20 to generate random tropes with variable Intensity and Longevity
          </p>
        </div>

        {/* Charge Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-700">Energy Charges</h3>
            <div className="flex gap-2">
              <button
                onClick={addCharge}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all"
              >
                + Add Charge
              </button>
            </div>
          </div>

          {/* 5-Segment Charge Bar */}
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((segment) => {
              const isFullyAvailable = availableCharges >= segment;
              const isFullyFilled = currentCharges >= segment;
              const isPartiallyAvailable = !isFullyAvailable && availableCharges > segment - 1;
              const isPartiallyLocked = !isFullyFilled && currentCharges > segment - 1 && !isPartiallyAvailable;

              // Calculate opacity for partial fills (0-1 range)
              const availableOpacity = isPartiallyAvailable ? (availableCharges - (segment - 1)) : 1;
              const lockedOpacity = isPartiallyLocked ? (currentCharges - (segment - 1)) : 1;

              return (
                <div
                  key={segment}
                  className={`flex-1 h-10 rounded-lg border-2 transition-all duration-300 relative overflow-hidden ${
                    isFullyAvailable
                      ? 'border-purple-600 shadow-md'
                      : isFullyFilled
                      ? 'border-amber-600 shadow-md'
                      : 'border-gray-300'
                  }`}
                >
                  {/* Background fill with opacity for partial charges */}
                  {isFullyAvailable && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600" />
                  )}
                  {isPartiallyAvailable && (
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600"
                      style={{ opacity: availableOpacity }}
                    />
                  )}
                  {!isPartiallyAvailable && isFullyFilled && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500" />
                  )}
                  {!isPartiallyAvailable && isPartiallyLocked && (
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500"
                      style={{ opacity: lockedOpacity }}
                    />
                  )}
                  {!isFullyAvailable && !isPartiallyAvailable && !isFullyFilled && !isPartiallyLocked && (
                    <div className="absolute inset-0 bg-gray-100" />
                  )}

                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isFullyAvailable && <span className="text-white font-bold text-base">⚡</span>}
                    {!isFullyAvailable && isFullyFilled && <span className="text-white font-bold text-base">🔒</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Available: <span className="font-semibold text-purple-600">{formatCharges(availableCharges)}</span>
            </span>
            {lockedCharges > 0 && (
              <span className="text-amber-600">
                <span className="font-semibold">{lockedCharges}</span> locked in bank
              </span>
            )}
            <span className="text-gray-600">
              Total: <span className="font-semibold">{formatCharges(currentCharges)} / 5</span>
            </span>
          </div>
        </div>

        {/* Pending Roll Workflow - Moved between charge bar and pull button */}
        {pendingRoll && (
          <PendingRollComponent
            pendingRoll={pendingRoll}
            onFail={handleFail}
            onBank={handleBank}
            onApply={handleApply}
            formatEffectDescription={formatEffectDescription}
          />
        )}

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <button
              onClick={pullNewTrope}
              disabled={availableCharges < 1 || pendingRoll !== null}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-base rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🎲 Pull New Trope
            </button>
            <div className="text-sm font-medium space-x-4">
              <span className="text-purple-600">Active: <span className="font-bold">{activeRolls.length}</span></span>
              <span className="text-amber-600">Banked: <span className="font-bold">{bankedRolls.length}/5</span></span>
              <span className="text-gray-500">Expired: <span className="font-bold">{expiredRolls.length}</span></span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveGame}
                className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 font-medium shadow-md hover:shadow-lg transition-all"
              >
                💾 Save
              </button>
              <button
                onClick={loadGame}
                className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 font-medium shadow-md hover:shadow-lg transition-all"
              >
                📂 Load
              </button>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Trope Categories</h3>
            <div className="flex gap-2">
              <button
                onClick={enableAllCategories}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 font-medium shadow-md transition-all"
              >
                ✓ All
              </button>
              <button
                onClick={disableAllCategories}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 font-medium shadow-md transition-all"
              >
                ✗ None
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(activeCategories).map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition-colors">
                <input
                  type="checkbox"
                  checked={activeCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bonus Modifier Display */}
        {bonusModifier && (
          <BonusModifierComponent
            bonusModifier={bonusModifier}
            activeRolls={activeRolls}
            onApplyBonus={applyBonusModifier}
          />
        )}

        {/* Banked Tropes */}
        {bankedRolls.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-3 border-2 border-amber-400">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🔒</span>
              <h3 className="text-base font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Banked Tropes ({bankedRolls.length}/5)
              </h3>
            </div>
            <div className="space-y-2">
              {bankedRolls.map(roll => (
                <div key={roll.id} className="bg-white p-3 rounded-lg border border-amber-400 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-800 mb-1">{roll.trope}</h4>
                      <div className="flex items-center gap-1 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                          {roll.category}
                        </span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">
                          Int: {roll.intensity} | Long: {roll.longevity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Target: <span className="font-medium">{roll.appliedTo}</span></p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => unbankTrope(roll.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all"
                      >
                        ⚡ Unbank
                      </button>
                      <button
                        onClick={() => deleteRoll(roll.id, true)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 shadow-sm hover:shadow-md transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active/Expired Tropes Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-purple-200 overflow-hidden">
          <div className="border-b border-purple-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 px-4 py-2 font-bold text-sm transition-all ${
                  activeTab === 'active'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚡ Active ({activeRolls.length})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`flex-1 px-4 py-2 font-bold text-sm transition-all ${
                  activeTab === 'expired'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💤 Expired ({expiredRolls.length})
              </button>
            </div>
          </div>
          <div className="p-3 space-y-2 bg-gradient-to-br from-gray-50 to-purple-50">
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
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No active tropes</p>
                <p className="text-gray-400 text-sm mt-2">Pull a trope to get started!</p>
              </div>
            )}
            {activeTab === 'expired' && expiredRolls.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No expired tropes</p>
                <p className="text-gray-400 text-sm mt-2">Mark active tropes as expired to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bonus Modifier Component
function BonusModifierComponent({ bonusModifier, activeRolls, onApplyBonus }: any) {
  const [selectedTropeId, setSelectedTropeId] = useState<number | null>(null);
  const [applyTo, setApplyTo] = useState<'intensity' | 'longevity'>('intensity');

  // Determine if this bonus requires choosing a stat
  const requiresChoice = ['plus3', 'minus5', 'reroll'].includes(bonusModifier.type);
  const isAutomatic = ['permanent', 'swap', 'refresh', 'expire', 'retarget'].includes(bonusModifier.type);

  const handleApply = () => {
    if (selectedTropeId === null) {
      alert('Please select a trope to apply the bonus modifier to.');
      return;
    }
    onApplyBonus(selectedTropeId, isAutomatic ? 'auto' : applyTo);
  };

  // Get descriptive text for the bonus effect
  const getEffectLabel = (stat: 'intensity' | 'longevity') => {
    switch (bonusModifier.type) {
      case 'plus3': return `${stat === 'intensity' ? 'Intensity' : 'Longevity'} (+3)`;
      case 'minus5': return `${stat === 'intensity' ? 'Intensity' : 'Longevity'} (-5)`;
      case 'reroll': return `Reroll ${stat === 'intensity' ? 'Intensity' : 'Longevity'} Die`;
      default: return `${stat === 'intensity' ? 'Intensity' : 'Longevity'} (+1)`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-lg p-3 border-2 border-yellow-400">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🎉</span>
        <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
          Bonus Modifier Ready
        </h3>
      </div>
      <div className="bg-white p-3 rounded-lg border border-yellow-300 shadow-sm">
        <p className="font-bold text-base text-gray-800 mb-1">{bonusModifier.name}</p>
        <p className="text-xs text-gray-700 mb-3">{bonusModifier.description}</p>

        {activeRolls.length > 0 ? (
          <>
            <div className="mb-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Trope:</label>
              <select
                value={selectedTropeId || ''}
                onChange={(e) => setSelectedTropeId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 text-xs rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200"
              >
                <option value="">-- Choose a trope --</option>
                {activeRolls.map((roll: any) => (
                  <option key={roll.id} value={roll.id}>
                    {roll.trope} (Int: {roll.intensity}, Long: {roll.longevity})
                  </option>
                ))}
              </select>
            </div>

            {requiresChoice && (
              <div className="mb-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Apply to:</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="applyTo"
                      value="intensity"
                      checked={applyTo === 'intensity'}
                      onChange={(e) => setApplyTo(e.target.value as 'intensity' | 'longevity')}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <span className="text-xs font-medium text-gray-700">{getEffectLabel('intensity')}</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="applyTo"
                      value="longevity"
                      checked={applyTo === 'longevity'}
                      onChange={(e) => setApplyTo(e.target.value as 'intensity' | 'longevity')}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <span className="text-xs font-medium text-gray-700">{getEffectLabel('longevity')}</span>
                  </label>
                </div>
              </div>
            )}

            {isAutomatic && (
              <div className="mb-3 bg-yellow-100 border border-yellow-400 rounded-lg p-2">
                <p className="text-xs font-semibold text-yellow-800">
                  ℹ️ This bonus will be applied automatically to the selected trope.
                </p>
              </div>
            )}

            <button
              onClick={handleApply}
              className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold text-sm rounded-lg hover:from-yellow-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
            >
              ⚡ Apply Bonus Modifier
            </button>
          </>
        ) : (
          <p className="text-xs text-gray-500 italic">No active tropes to apply bonus to. Pull a trope first!</p>
        )}
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
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-xl p-4 border-2 border-purple-400">
      {(pendingRoll.die1Original === 20 || pendingRoll.die2Original === 20) && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 rounded-lg p-3 mb-3 shadow-md">
          <div className="flex items-start space-x-2">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-base text-yellow-800">Natural 20! Bonus Modifier Earned</p>
              <p className="text-xs text-gray-700">The 20 has been rerolled to 19 for this trope</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{pendingRoll.trope}</h2>
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-xs font-bold shadow-md">
          {pendingRoll.category}
        </span>
      </div>
      <p className="text-gray-700 italic text-sm mb-3 leading-relaxed">{pendingRoll.description}</p>

      <div className="bg-white rounded-lg p-2 mb-3 border border-purple-300 shadow-sm">
        <p className="font-semibold text-sm text-gray-800">
          <span className="text-purple-600">Rolled: </span>
          {pendingRoll.die1Original === 20 ? (
            <><del className="text-gray-400">20</del> <span className="text-purple-600">→ 19</span></>
          ) : pendingRoll.die1Original === 1 ? (
            <><del className="text-gray-400">1</del> <span className="text-purple-600">→ {pendingRoll.die1}</span></>
          ) : (
            <span className="text-purple-600">{pendingRoll.die1}</span>
          )}
          {' & '}
          {pendingRoll.die2Original === 20 ? (
            <><del className="text-gray-400">20</del> <span className="text-purple-600">→ 19</span></>
          ) : pendingRoll.die2Original === 1 ? (
            <><del className="text-gray-400">1</del> <span className="text-purple-600">→ {pendingRoll.die2}</span></>
          ) : (
            <span className="text-purple-600">{pendingRoll.die2}</span>
          )}
        </p>
      </div>

      {(pendingRoll.die1 === 1 || pendingRoll.die2 === 1) && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-400 rounded-lg p-2 mb-3 shadow-sm">
          <p className="text-amber-800 text-sm font-medium flex items-center gap-1">
            <span>⚠️</span> Natural 1 detected - Blind reroll will occur on APPLY
          </p>
        </div>
      )}

      <div className="mb-3">
        <p className="font-bold text-sm text-gray-800 mb-2">Dice Assignment:</p>
        {/* Side-by-side assignment buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAssignment('die1ToIntensity')}
            className={`p-2 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${
              assignment === 'die1ToIntensity'
                ? 'border-purple-600 bg-gradient-to-r from-purple-100 to-indigo-100 shadow-md'
                : 'border-gray-300 bg-white hover:border-purple-400'
            }`}
          >
            <div className="font-bold text-sm text-gray-800">
              Int: {pendingRoll.die1} | Long: {pendingRoll.die2}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {formatEffectDescription(pendingRoll.die1, pendingRoll.die2)}
            </div>
          </button>
          <button
            onClick={() => setAssignment('die2ToIntensity')}
            className={`p-2 rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${
              assignment === 'die2ToIntensity'
                ? 'border-purple-600 bg-gradient-to-r from-purple-100 to-indigo-100 shadow-md'
                : 'border-gray-300 bg-white hover:border-purple-400'
            }`}
          >
            <div className="font-bold text-sm text-gray-800">
              Int: {pendingRoll.die2} | Long: {pendingRoll.die1}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {formatEffectDescription(pendingRoll.die2, pendingRoll.die1)}
            </div>
          </button>
        </div>
      </div>

      <div className="mb-3 bg-white rounded-lg p-2 border border-gray-300 shadow-sm">
        <label className="block font-bold text-sm text-gray-800 mb-2">Target:</label>
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          className="w-full p-2 border border-gray-300 text-sm rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all"
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
            className="w-full p-2 border border-gray-300 text-sm rounded-lg mt-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onFail}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all"
        >
          ❌ FAIL
        </button>
        <button
          onClick={() => onBank(assignment, target)}
          disabled={false}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 shadow-md hover:shadow-lg transition-all"
        >
          🔒 BANK
        </button>
        <button
          onClick={() => onApply(assignment, target)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-sm rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
        >
          ⚡ APPLY
        </button>
      </div>
    </div>
  );
}

// Trope Card Component
function TropeCard({ roll, onToggleExpired, onDelete, onCollectRefund, formatEffectDescription, showRefund }: any) {
  const refund = showRefund ? calculateRefund(roll.intensity, roll.longevity) : 0;
  const isPermanent = roll.longevity === 20;

  return (
    <div className={`rounded-lg p-3 border shadow-md hover:shadow-lg transition-all ${
      roll.expired
        ? 'border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100'
        : isPermanent
        ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-indigo-100'
        : 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-xs font-bold shadow-sm">
            {roll.category}
          </span>
          <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-medium shadow-sm">
            {roll.appliedTo}
          </span>
          {roll.rerolledFrom20 && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-white rounded-full text-xs font-medium shadow-sm">
              🎉 Bonus
            </span>
          )}
          {roll.rerolledFrom1 && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-medium shadow-sm">
              ⚠️ Reroll
            </span>
          )}
          {roll.bonusApplied && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-medium shadow-sm">
              ✨ Bonus Applied
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {!isPermanent && (
            <button
              onClick={() => onToggleExpired(roll.id)}
              className={`px-2 py-1 text-xs font-medium rounded-md shadow-sm hover:shadow-md transition-all ${
                roll.expired
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
              }`}
            >
              {roll.expired ? '♻️' : '💤'}
            </button>
          )}
          {isPermanent && (
            <span className="px-2 py-1 text-xs font-bold text-purple-700 bg-purple-200 rounded-md">
              ∞ Permanent
            </span>
          )}
          <button
            onClick={() => onDelete(roll.id)}
            className="px-2 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-medium rounded-md hover:from-red-700 hover:to-red-800 shadow-sm hover:shadow-md transition-all"
          >
            🗑️
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-1 text-gray-800">{roll.trope}</h3>
      <p className="text-gray-700 italic text-xs mb-2 leading-relaxed">{TROPE_DESCRIPTIONS[roll.trope]}</p>

      <div className="bg-white border border-purple-300 rounded-md p-2 mb-2 shadow-sm">
        <p className="font-bold text-sm text-purple-800">
          {formatEffectDescription(roll.intensity, roll.longevity)}
        </p>
      </div>

      <div className="text-xs text-gray-700 bg-white rounded-md p-2 border border-gray-200">
        <p className="font-medium">
          <span className="text-purple-600 font-semibold">Dice:</span>{' '}
          {roll.die1Original === 20 || roll.die1Original === 1 ? (
            <><del className="text-gray-400">{roll.die1Original}</del> → <span className="text-purple-600 font-bold">{roll.die1}</span></>
          ) : (
            <span className="text-purple-600 font-bold">{roll.die1}</span>
          )}
          {' & '}
          {roll.die2Original === 20 || roll.die2Original === 1 ? (
            <><del className="text-gray-400">{roll.die2Original}</del> → <span className="text-purple-600 font-bold">{roll.die2}</span></>
          ) : (
            <span className="text-purple-600 font-bold">{roll.die2}</span>
          )}
          {' | '}
          <span className="font-semibold">Int:</span> {roll.intensity} | <span className="font-semibold">Long:</span> {roll.longevity}
        </p>
      </div>

      {showRefund && (
        <div className="mt-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-400 rounded-md p-2 shadow-sm">
          <p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1">
            <span>💰</span> Refund: {formatCharges(refund)} charges
          </p>
          <button
            onClick={() => onCollectRefund(roll.id)}
            className="w-full px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-md hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow-md transition-all"
          >
            ⚡ Collect Refund
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
