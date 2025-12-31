import { useState } from 'react';
import type { Roll, BonusModifier, ChallengeModifier, PendingRoll, TropeFilters } from './types';
import { TROPE_DESCRIPTIONS, ALL_TROPES } from './data/tropes';
import {
  rollDie,
  getRandomTrope,
  generateId,
  generateBonusModifier,
  generateChallengeModifier,
  formatEffectDescription,
  formatCharges,
  handleReroll
} from './utils/helpers';
import { calculateRefund } from './utils/refundCalculator';
import './App.css';

function App() {
  // State management
  const [currentCharges, setCurrentCharges] = useState(5.0);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [bankedRolls, setBankedRolls] = useState<Roll[]>([]);
  const [bonusModifier, setBonusModifier] = useState<BonusModifier | null>(null);
  const [challengeModifier, setChallengeModifier] = useState<ChallengeModifier | null>(null);
  const [pendingRoll, setPendingRoll] = useState<PendingRoll | null>(null);
  const [filters, setFilters] = useState<TropeFilters>({
    target: 'Self',
    situation: 'Physical Conflict',
    fanserviceEnabled: false,
    gender: undefined
  });
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [username] = useState('Player');
  const [displayFilters, setDisplayFilters] = useState({
    targets: [] as string[],
    onlyPermanent: false,
    onlyBonus: false,
    onlyChallenge: false,
  });

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

    // Check for Natural 20s - generate bonus but keep die value at 20
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
      alert(`🎉 Natural 20! Bonus Modifier Earned: ${newBonus.name}\n\n${newBonus.description}\n\nThe 20 remains as true permanent!`);
      rerolledFrom20 = true;
    }

    // Get random trope
    try {
      const tropeData = getRandomTrope(filters);
      const trope = tropeData.name;
      const description = tropeData.description || TROPE_DESCRIPTIONS[trope] || 'No description available.';

      // Create pending roll
      const pending: PendingRoll = {
        id: generateId(),
        trope,
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

    // Handle Natural 1 rerolls and generate challenge
    if (die1 === 1 || die2 === 1) {
      // Generate challenge modifier
      const newChallenge = generateChallengeModifier(0);

      // Warn if challenge already exists
      if (challengeModifier) {
        const confirmed = window.confirm(
          `You already have a challenge modifier (${challengeModifier.name})! Rolling this Natural 1 will overwrite it. Continue?`
        );
        if (!confirmed) {
          // Still apply the trope but don't generate new challenge
        } else {
          setChallengeModifier(newChallenge);
          alert(`⚠️ Natural 1! Challenge Received: ${newChallenge.name}\n\n${newChallenge.description}`);
        }
      } else {
        setChallengeModifier(newChallenge);
        alert(`⚠️ Natural 1! Challenge Received: ${newChallenge.name}\n\n${newChallenge.description}`);
      }

      // Reroll the 1s blind
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

  // Toggle expired status
  const toggleExpired = (rollId: number) => {
    const roll = rolls.find(r => r.id === rollId);
    if (!roll) return;

    // If marking as expired, auto-refund charges
    if (!roll.expired) {
      const refund = (roll.intensity + roll.longevity) / 40;
      setCurrentCharges(prev => Math.min(5, prev + refund));
    }

    setRolls(prev => prev.map(r =>
      r.id === rollId ? { ...r, expired: !r.expired } : r
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
          case 'plus5':
            // Add +5 to selected stat (max 20)
            if (applyTo === 'intensity') {
              updatedRoll.intensity = Math.min(20, roll.intensity + 5);
              message = `Intensity increased by 5 to ${updatedRoll.intensity}.`;
            } else {
              updatedRoll.longevity = Math.min(20, roll.longevity + 5);
              message = `Longevity increased by 5 to ${updatedRoll.longevity}.`;
            }
            break;

          case 'permanent':
            // Set longevity to 20 (true permanent)
            updatedRoll.longevity = 20;
            message = 'Trope is now permanent! Longevity set to 20 (never expires).';
            break;

          case 'retarget':
            // Change the target of the trope
            const newTarget = prompt('Enter new target name:', roll.appliedTo);
            if (newTarget && newTarget.trim()) {
              updatedRoll.appliedTo = newTarget.trim();
              message = `Target changed to: ${newTarget.trim()}.`;
            } else {
              return roll; // No change if cancelled
            }
            break;

          case 'plus3charge':
            // This is auto-applied when generated
            message = '+3 charges already applied when bonus was earned.';
            break;

          case 'refresh':
            // Reset longevity to original die value
            const originalLongevity = roll.intensity === roll.die1 ? roll.die2 : roll.die1;
            updatedRoll.longevity = originalLongevity;
            updatedRoll.expired = false; // Can refresh expired tropes
            message = `Duration refreshed! Longevity reset to ${updatedRoll.longevity}.`;
            break;

          case 'swap':
            // Swap intensity and longevity
            updatedRoll.intensity = roll.longevity;
            updatedRoll.longevity = roll.intensity;
            message = `Intensity and Longevity swapped! Now Int: ${updatedRoll.intensity}, Long: ${updatedRoll.longevity}.`;
            break;

          case 'allatonce':
            // Set intensity to 20 and longevity to 2
            updatedRoll.intensity = 20;
            updatedRoll.longevity = 2;
            message = 'All at Once applied! Intensity: 20, Longevity: 2 (maximum power, minimum duration).';
            break;

          default:
            message = 'Unknown bonus type.';
        }

        alert(`Bonus modifier applied! ${message}`);
        return updatedRoll;
      }
      return roll;
    }));

    // Clear the bonus modifier after use
    setBonusModifier(null);
  };

  // Apply challenge modifier to a trope (or apply automatic effects)
  const applyChallengeModifier = (rollId: number, applyTo: 'intensity' | 'longevity' | 'auto') => {
    if (!challengeModifier) return;

    // Handle auto-apply challenges
    if (challengeModifier.type === 'minus2charge') {
      setCurrentCharges(prev => Math.max(0, prev - 2));
      alert(`Challenge applied! Lost 2 energy charges.`);
      setChallengeModifier(null);
      return;
    }

    setRolls(prev => prev.map(roll => {
      if (roll.id === rollId) {
        let updatedRoll = { ...roll, challengeApplied: true };
        let message = '';

        switch (challengeModifier.type) {
          case 'expire':
            // Mark the trope as expired
            updatedRoll.expired = true;
            message = 'Trope has been expired.';
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

          case 'subvert':
            // This would require looking up the subversion from trope data
            message = 'Subversion feature not yet implemented.';
            break;

          case 'rebound':
            // Reassign to a different target
            const newTarget = prompt('Enter new target for rebound:', roll.appliedTo);
            if (newTarget && newTarget.trim()) {
              updatedRoll.appliedTo = newTarget.trim();
              message = `Trope rebounded to: ${newTarget.trim()}.`;
            } else {
              return roll; // No change if cancelled
            }
            break;

          case 'balance':
            // Duplicate on enemy - this would require creating a new roll
            message = 'Balance in Everything: You need to manually create a duplicate on an enemy.';
            break;

          default:
            message = 'Unknown challenge type.';
        }

        alert(`Challenge applied! ${message}`);
        return updatedRoll;
      }
      return roll;
    }));

    // Clear the challenge modifier after use
    setChallengeModifier(null);
  };

  // Save game to CSV file
  const saveGame = () => {
    const gameState = {
      username,
      lastSaved: new Date().toISOString(),
      daysSinceTrigger: 0,
      currentCharges,
      rolls,
      bankedRolls,
      bonusModifier,
      challengeModifier,
      filters
    };

    // Convert to CSV format
    const csvData = JSON.stringify(gameState);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `plot-twist-save-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Game saved! File downloaded.');
  };

  // Load game from CSV file
  const loadGame = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const csvContent = event.target.result;
          const loadedState = JSON.parse(csvContent);

          setCurrentCharges(loadedState.currentCharges);
          setRolls(loadedState.rolls);
          setBankedRolls(loadedState.bankedRolls);
          setBonusModifier(loadedState.bonusModifier);
          setChallengeModifier(loadedState.challengeModifier || null);
          setFilters(loadedState.filters);
          alert(`Game loaded! Last saved: ${new Date(loadedState.lastSaved).toLocaleString()}`);
        } catch (error) {
          alert('Failed to load game. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  // Filter active and expired rolls
  const allActiveRolls = rolls.filter(r => !r.expired);
  const expiredRolls = rolls.filter(r => r.expired);

  // Apply display filters to active rolls
  const activeRolls = allActiveRolls.filter(roll => {
    // Target filter
    if (displayFilters.targets.length > 0) {
      const targetType = roll.appliedTo === 'Danny' ? 'Self' :
        ['Companion', 'Ally', 'Enemy', 'Animal', 'Object', 'Area'].find(t =>
          roll.appliedTo?.toLowerCase().includes(t.toLowerCase())
        ) || 'Companion';
      if (!displayFilters.targets.includes(targetType)) return false;
    }

    // Permanent filter
    if (displayFilters.onlyPermanent && roll.longevity < 19) return false;

    // Bonus filter
    if (displayFilters.onlyBonus && !roll.bonusApplied) return false;

    // Challenge filter
    if (displayFilters.onlyChallenge && !roll.challengeApplied) return false;

    return true;
  });

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
                      ? 'border-yellow-600 shadow-md'
                      : isFullyFilled
                      ? 'border-orange-600 shadow-md'
                      : 'border-gray-300'
                  }`}
                >
                  {/* Background fill with opacity for partial charges */}
                  {isFullyAvailable && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-amber-600" />
                  )}
                  {isPartiallyAvailable && (
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-amber-600"
                      style={{ opacity: availableOpacity }}
                    />
                  )}
                  {!isPartiallyAvailable && isFullyFilled && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800" />
                  )}
                  {!isPartiallyAvailable && isPartiallyLocked && (
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800"
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
              Available: <span className="font-semibold text-yellow-700">{formatCharges(availableCharges)}</span>
            </span>
            {lockedCharges > 0 && (
              <span className="text-gray-600">
                <span className="font-semibold text-orange-700">{lockedCharges}</span> locked in bank
              </span>
            )}
            <span className="text-gray-600">
              Total: <span className="font-semibold">{formatCharges(currentCharges)} / 5</span>
            </span>
          </div>
        </div>

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

        {/* Pending Roll Workflow */}
        {pendingRoll && (
          <PendingRollComponent
            pendingRoll={pendingRoll}
            onFail={handleFail}
            onBank={handleBank}
            onApply={handleApply}
            formatEffectDescription={formatEffectDescription}
            filters={filters}
          />
        )}

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Trope Filters</h3>

          <div className="space-y-2">
            {/* Target and Situation on same row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Target:</label>
                <select
                  value={filters.target}
                  onChange={(e) => setFilters(prev => ({ ...prev, target: e.target.value }))}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Self">Self</option>
                  <option value="Companion">Companion</option>
                  <option value="Ally">Ally</option>
                  <option value="Enemy">Enemy</option>
                  <option value="Animal">Animal</option>
                  <option value="Object">Object</option>
                  <option value="Area">Area</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Situation:</label>
                <select
                  value={filters.situation}
                  onChange={(e) => setFilters(prev => ({ ...prev, situation: e.target.value }))}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Physical Conflict">Physical Conflict</option>
                  <option value="Social Conflict">Social Conflict</option>
                  <option value="At Rest">At Rest</option>
                </select>
              </div>
            </div>

            {/* Fanservice checkbox and Gender dropdown on same row */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.fanserviceEnabled}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    fanserviceEnabled: e.target.checked,
                    gender: e.target.checked ? 'masculine' : undefined
                  }))}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Fanservice</span>
              </label>

              {filters.fanserviceEnabled && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Gender:</label>
                  <select
                    value={filters.gender || 'masculine'}
                    onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="masculine">Masculine</option>
                    <option value="feminine">Feminine</option>
                  </select>
                </div>
              )}
            </div>
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

        {/* Challenge Modifier Display */}
        {challengeModifier && (
          <ChallengeModifierComponent
            challengeModifier={challengeModifier}
            activeRolls={activeRolls}
            onApplyChallenge={applyChallengeModifier}
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

          {/* Display Filters for Active Tab */}
          {activeTab === 'active' && allActiveRolls.length > 0 && (
            <div className="p-3 bg-gray-100 border-b border-gray-200">
              <div className="flex flex-wrap gap-3 items-center text-xs">
                <span className="font-semibold text-gray-700">Filter:</span>

                {/* Target Type Filters */}
                {['Self', 'Companion', 'Ally', 'Enemy', 'Animal', 'Object', 'Area'].map(target => (
                  <label key={target} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={displayFilters.targets.includes(target)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDisplayFilters(prev => ({ ...prev, targets: [...prev.targets, target] }));
                        } else {
                          setDisplayFilters(prev => ({ ...prev, targets: prev.targets.filter(t => t !== target) }));
                        }
                      }}
                      className="w-3 h-3 rounded"
                    />
                    <span className="text-gray-700">{target}</span>
                  </label>
                ))}

                <span className="text-gray-400">|</span>

                {/* Status Filters */}
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayFilters.onlyPermanent}
                    onChange={(e) => setDisplayFilters(prev => ({ ...prev, onlyPermanent: e.target.checked }))}
                    className="w-3 h-3 rounded"
                  />
                  <span className="text-gray-700">Permanent</span>
                </label>

                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayFilters.onlyBonus}
                    onChange={(e) => setDisplayFilters(prev => ({ ...prev, onlyBonus: e.target.checked }))}
                    className="w-3 h-3 rounded"
                  />
                  <span className="text-gray-700">Bonus Applied</span>
                </label>

                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={displayFilters.onlyChallenge}
                    onChange={(e) => setDisplayFilters(prev => ({ ...prev, onlyChallenge: e.target.checked }))}
                    className="w-3 h-3 rounded"
                  />
                  <span className="text-gray-700">Challenge Applied</span>
                </label>

                {/* Clear Filters */}
                {(displayFilters.targets.length > 0 || displayFilters.onlyPermanent || displayFilters.onlyBonus || displayFilters.onlyChallenge) && (
                  <button
                    onClick={() => setDisplayFilters({ targets: [], onlyPermanent: false, onlyBonus: false, onlyChallenge: false })}
                    className="ml-2 px-2 py-0.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}

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
  const requiresChoice = ['plus5'].includes(bonusModifier.type);
  const isAutomatic = ['permanent', 'swap', 'refresh', 'retarget', 'allatonce'].includes(bonusModifier.type);
  const requiresTrope = !['plus3charge'].includes(bonusModifier.type);

  const handleApply = () => {
    if (requiresTrope && selectedTropeId === null) {
      alert('Please select a trope to apply the bonus modifier to.');
      return;
    }
    onApplyBonus(selectedTropeId, isAutomatic ? 'auto' : applyTo);
  };

  // Get descriptive text for the bonus effect
  const getEffectLabel = (stat: 'intensity' | 'longevity') => {
    switch (bonusModifier.type) {
      case 'plus5': return `${stat === 'intensity' ? 'Intensity' : 'Longevity'} (+5)`;
      default: return `${stat === 'intensity' ? 'Intensity' : 'Longevity'}`;
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

        {!requiresTrope ? (
          <button
            onClick={handleApply}
            className="w-full px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold text-sm rounded-lg hover:from-yellow-700 hover:to-amber-700 shadow-md hover:shadow-lg transition-all"
          >
            ⚡ Apply Bonus
          </button>
        ) : activeRolls.length > 0 ? (
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

// Challenge Modifier Component
function ChallengeModifierComponent({ challengeModifier, activeRolls, onApplyChallenge }: any) {
  const [selectedTropeId, setSelectedTropeId] = useState<number | null>(null);
  const [applyTo, setApplyTo] = useState<'intensity' | 'longevity'>('intensity');

  // Determine if this challenge requires choosing a stat
  const requiresChoice = ['minus5'].includes(challengeModifier.type);
  const isAutomatic = ['expire', 'rebound', 'balance', 'subvert'].includes(challengeModifier.type);
  const requiresTrope = !['minus2charge'].includes(challengeModifier.type);

  const handleApply = () => {
    // Auto-apply challenges don't need a trope selection
    if (!requiresTrope) {
      onApplyChallenge(null, 'auto');
      return;
    }

    if (selectedTropeId === null) {
      alert('Please select a trope to apply the challenge modifier to.');
      return;
    }
    onApplyChallenge(selectedTropeId, isAutomatic ? 'auto' : applyTo);
  };

  // Get descriptive text for the challenge effect
  const getEffectLabel = (stat: 'intensity' | 'longevity') => {
    switch (challengeModifier.type) {
      case 'minus5': return `${stat === 'intensity' ? 'Intensity' : 'Longevity'} (-5)`;
      default: return `${stat === 'intensity' ? 'Intensity' : 'Longevity'}`;
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-3 border-2 border-red-400">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">⚠️</span>
        <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Challenge Modifier Active
        </h3>
      </div>
      <div className="bg-white p-3 rounded-lg border border-red-300 shadow-sm">
        <p className="font-bold text-base text-gray-800 mb-1">{challengeModifier.name}</p>
        <p className="text-xs text-gray-700 mb-3">{challengeModifier.description}</p>

        {!requiresTrope ? (
          <button
            onClick={handleApply}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-sm rounded-lg hover:from-red-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all"
          >
            ⚡ Apply Challenge
          </button>
        ) : activeRolls.length > 0 ? (
          <>
            <div className="mb-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Trope:</label>
              <select
                value={selectedTropeId || ''}
                onChange={(e) => setSelectedTropeId(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 text-xs rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200"
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
                      className="w-4 h-4 text-red-600"
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
                      className="w-4 h-4 text-red-600"
                    />
                    <span className="text-xs font-medium text-gray-700">{getEffectLabel('longevity')}</span>
                  </label>
                </div>
              </div>
            )}

            {isAutomatic && (
              <div className="mb-3 bg-red-100 border border-red-400 rounded-lg p-2">
                <p className="text-xs font-semibold text-red-800">
                  ⚠️ This challenge will be applied automatically to the selected trope.
                </p>
              </div>
            )}

            <button
              onClick={handleApply}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-sm rounded-lg hover:from-red-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all"
            >
              ⚡ Apply Challenge Modifier
            </button>
          </>
        ) : (
          <p className="text-xs text-gray-500 italic">No active tropes to apply challenge to. Pull a trope first!</p>
        )}
      </div>
    </div>
  );
}

// Pending Roll Component
function PendingRollComponent({ pendingRoll, onFail, onBank, onApply, formatEffectDescription, filters }: any) {
  const [assignment, setAssignment] = useState<'die1ToIntensity' | 'die2ToIntensity'>('die1ToIntensity');

  const handleBank = () => {
    let target: string;
    if (filters.target === 'Self') {
      target = 'Danny';
    } else {
      const targetName = prompt(`Enter name for ${filters.target}:`, filters.target);
      if (!targetName || !targetName.trim()) {
        return; // Cancel if no name provided
      }
      target = targetName.trim();
    }
    onBank(assignment, target);
  };

  const handleApply = () => {
    let target: string;
    if (filters.target === 'Self') {
      target = 'Danny';
    } else {
      const targetName = prompt(`Enter name for ${filters.target}:`, filters.target);
      if (!targetName || !targetName.trim()) {
        return; // Cancel if no name provided
      }
      target = targetName.trim();
    }
    onApply(assignment, target);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-xl p-4 border-2 border-purple-400">
      {pendingRoll.rerolledFrom20 && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 rounded-lg p-3 mb-3 shadow-md">
          <div className="flex items-start space-x-2">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-base text-yellow-800">Natural 20! Bonus Modifier Earned</p>
              <p className="text-xs text-gray-700">The 20 remains as true permanent</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <h2 className="text-2xl font-bold text-gray-800">{pendingRoll.trope}</h2>
      </div>
      <p className="text-gray-700 italic text-sm mb-3 leading-relaxed">{pendingRoll.description}</p>

      <div className="bg-white rounded-lg p-2 mb-3 border border-purple-300 shadow-sm">
        <p className="font-semibold text-sm text-gray-800">
          <span className="text-purple-600">Rolled: </span>
          <span className="text-purple-600">{pendingRoll.die1}</span>
          {' & '}
          <span className="text-purple-600">{pendingRoll.die2}</span>
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
        <p className="font-bold text-sm text-gray-800">
          <span className="text-purple-600">Target: </span>
          <span className="text-gray-800">{filters.target === 'Self' ? 'Danny' : filters.target}</span>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onFail}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm rounded-lg hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all"
        >
          ❌ FAIL
        </button>
        <button
          onClick={handleBank}
          disabled={false}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 shadow-md hover:shadow-lg transition-all"
        >
          🔒 BANK
        </button>
        <button
          onClick={handleApply}
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
  const isPermanent = roll.longevity >= 19;

  // Look up trope data for TV Tropes link
  const tropeData = ALL_TROPES.find(t => t.name === roll.trope);

  // Determine target type for color tinting
  const getTargetType = (appliedTo: string) => {
    if (appliedTo === 'Danny') return 'Self';
    // Check if it's one of the standard types
    const standardTypes = ['Companion', 'Ally', 'Enemy', 'Animal', 'Object', 'Area'];
    for (const type of standardTypes) {
      if (appliedTo.toLowerCase().includes(type.toLowerCase())) return type;
    }
    // Default: assume it's a named target, likely Companion
    return 'Companion';
  };

  const targetType = getTargetType(roll.appliedTo || 'Self');

  // Color schemes by target type
  const getColorScheme = () => {
    if (roll.expired) {
      return 'border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100';
    }

    const schemes: Record<string, string> = {
      'Self': isPermanent
        ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-indigo-100'
        : 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50',
      'Companion': isPermanent
        ? 'border-blue-500 bg-gradient-to-br from-blue-100 to-cyan-100'
        : 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50',
      'Ally': isPermanent
        ? 'border-green-500 bg-gradient-to-br from-green-100 to-emerald-100'
        : 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50',
      'Enemy': isPermanent
        ? 'border-red-500 bg-gradient-to-br from-red-100 to-orange-100'
        : 'border-red-400 bg-gradient-to-br from-red-50 to-orange-50',
      'Animal': isPermanent
        ? 'border-amber-500 bg-gradient-to-br from-amber-100 to-yellow-100'
        : 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50',
      'Object': isPermanent
        ? 'border-gray-500 bg-gradient-to-br from-gray-100 to-slate-100'
        : 'border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50',
      'Area': isPermanent
        ? 'border-teal-500 bg-gradient-to-br from-teal-100 to-sky-100'
        : 'border-teal-400 bg-gradient-to-br from-teal-50 to-sky-50',
    };
    return schemes[targetType] || schemes['Self'];
  };

  return (
    <div className={`rounded-lg p-3 shadow-md hover:shadow-lg transition-all ${getColorScheme()}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-wrap gap-1">
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
          {roll.challengeApplied && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-medium shadow-sm">
              ⚠️ Challenge Applied
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
      {TROPE_DESCRIPTIONS[roll.trope] ? (
        <p className="text-gray-700 italic text-xs mb-2 leading-relaxed">{TROPE_DESCRIPTIONS[roll.trope]}</p>
      ) : (
        <p className="text-gray-400 italic text-xs mb-2 leading-relaxed">Description not available - check TV Tropes for details</p>
      )}

      {/* TV Tropes link */}
      {tropeData?.tvTropesUrl && (
        <div className="mb-2">
          <a
            href={tropeData.tvTropesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-medium rounded-md hover:from-indigo-600 hover:to-blue-600 shadow-sm hover:shadow-md transition-all"
          >
            📖 TV Tropes
          </a>
        </div>
      )}

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
