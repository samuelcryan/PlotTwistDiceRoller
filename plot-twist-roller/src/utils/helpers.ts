import { ALL_TROPES } from '../data/tropes';
import { INTENSITY_SCALE, LONGEVITY_SCALE, USES_SCALE } from '../data/scales';
import type { TropeData } from '../data/tropes';
import type { TropeFilters } from '../types';

/**
 * Roll a single d20
 */
export const rollDie = (): number => {
  return Math.floor(Math.random() * 20) + 1;
};

/**
 * Handle rerolls for natural 1s and 20s
 * - Natural 1 rerolled: treat rerolled 1 as 2
 * - Natural 20 rerolled: treat as 19
 */
export const handleReroll = (value: number): number => {
  if (value === 1) return 2; // Rerolled 1s become 2
  if (value === 20) return 19; // Rerolled 20s become 19
  return value;
};

/**
 * Check if longevity makes trope permanent
 */
export const isPermanent = (longevity: number): boolean => {
  return longevity >= 18;
};

/**
 * Check if longevity is true permanent (never expires)
 */
export const isTruePermanent = (longevity: number): boolean => {
  return longevity === 19;
};

/**
 * Get story date from days since trigger
 * Trigger date: January 7, 2011
 */
export const getStoryDate = (days: number): string => {
  const triggerDate = new Date(2011, 0, 7); // January 7, 2011
  const resultDate = new Date(triggerDate);
  resultDate.setDate(resultDate.getDate() + days);

  return resultDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format effect description in natural language
 */
export const formatEffectDescription = (intensity: number, longevity: number, tropeName?: string): string => {
  const intensityDesc = INTENSITY_SCALE[intensity];

  // Check if this trope uses the Uses system instead of duration
  let usesOngoing = 'Ongoing'; // default
  if (tropeName) {
    const tropeData = ALL_TROPES.find(t => t.name === tropeName);
    if (tropeData) {
      usesOngoing = tropeData.usesOngoing;
    }
  }

  if (usesOngoing === 'Uses') {
    // Use the Uses scale instead of Longevity scale
    const usesDesc = USES_SCALE[longevity];
    if (longevity >= 19) {
      return `A ${intensityDesc.toLowerCase()} effect with ${usesDesc.toLowerCase()}`;
    } else {
      return `A ${intensityDesc.toLowerCase()} effect with ${usesDesc.toLowerCase()}`;
    }
  } else {
    // Use the Longevity scale (duration-based)
    const longevityDesc = LONGEVITY_SCALE[longevity];
    if (longevity >= 19) {
      return `A ${intensityDesc.toLowerCase()} effect that is ${longevityDesc.toLowerCase()}`;
    } else {
      return `A ${intensityDesc.toLowerCase()} effect that lasts ${longevityDesc.toLowerCase()}`;
    }
  }
};

/**
 * Get random trope based on filter criteria
 */
export const getRandomTrope = (filters: TropeFilters): TropeData => {
  // Map UI values to data values
  const contextMap: { [key: string]: string } = {
    'Physical Conflict': 'Combat',
    'Social Conflict': 'Social',
    'At Rest': 'At Rest'
  };

  const targetMap: { [key: string]: string[] } = {
    'Self': ['Self', 'Human'],
    'Companion': ['Companion'],
    'Ally': ['Ally', 'Human'],
    'Enemy': ['Enemy', 'Human'],
    'Animal': ['Creature'],
    'Object': ['Object'],
    'Area': ['Area']
  };

  const mappedContext = contextMap[filters.situation] || filters.situation;
  const mappedTargets = targetMap[filters.target] || [filters.target];

  // Filter tropes based on criteria
  const matchingTropes = ALL_TROPES.filter(trope => {
    // Check if target matches
    const targetMatches = trope.targets.some(t => mappedTargets.includes(t));
    if (!targetMatches) return false;

    // Check if context matches (trope can have multiple contexts)
    const contextMatches = trope.contexts.includes(mappedContext);
    if (!contextMatches) return false;

    // Check gender filter (only if fanservice enabled)
    if (filters.fanserviceEnabled && filters.gender) {
      // If gender filter is specified, trope must either be 'any' or match the gender
      const genderMatches = trope.gender === 'any' || trope.gender === filters.gender;
      if (!genderMatches) return false;
    } else if (!filters.fanserviceEnabled) {
      // If fanservice disabled, exclude gender-specific tropes
      if (trope.gender !== 'any') return false;
    }

    return true;
  });

  if (matchingTropes.length === 0) {
    throw new Error(`No tropes match the selected filters: Target=${filters.target}, Situation=${filters.situation}, Fanservice=${filters.fanserviceEnabled}, Gender=${filters.gender || 'N/A'}`);
  }

  // Pick random trope from matching ones
  const randomTrope = matchingTropes[Math.floor(Math.random() * matchingTropes.length)];

  return randomTrope;
};

/**
 * Generate unique ID for rolls
 */
export const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Generate a bonus modifier from Natural 20
 */
export const generateBonusModifier = (dayEarned: number) => {
  const modifierTypes = [
    {
      type: 'plus5' as const,
      name: '+5 to Die Roll',
      description: 'Add 5 to any existing trope\'s Intensity or Longevity die (maximum 20)'
    },
    {
      type: 'permanent' as const,
      name: 'Make Permanent',
      description: 'Set any trope\'s Longevity value to 20 (true permanent, never expires)'
    },
    {
      type: 'retarget' as const,
      name: 'Change Active Trope Target',
      description: 'Move a trope from its current target to a different valid target'
    },
    {
      type: 'plus3charge' as const,
      name: '+3 Energy',
      description: 'Immediately restore 3 charges (auto-applies, up to maximum capacity)'
    },
    {
      type: 'refresh' as const,
      name: 'Refresh Trope',
      description: 'Reset any active or expired trope\'s duration to its original Longevity value'
    },
    {
      type: 'swap' as const,
      name: 'Swap Die Rolls',
      description: 'Exchange dice values between two different tropes (select Intensity or Longevity from each)'
    },
    {
      type: 'allatonce' as const,
      name: 'All at Once',
      description: 'Set a trope\'s Intensity to 20 and Longevity to 2 (maximum power, minimum duration)'
    }
  ];

  const randomModifier = modifierTypes[Math.floor(Math.random() * modifierTypes.length)];

  return {
    id: generateId(),
    ...randomModifier,
    dayEarned
  };
};

/**
 * Generate a challenge modifier from Natural 1
 */
export const generateChallengeModifier = (dayEarned: number) => {
  const modifierTypes = [
    {
      type: 'expire' as const,
      name: 'Expire Active Trope',
      description: 'Immediately end any active trope regardless of remaining duration'
    },
    {
      type: 'minus5' as const,
      name: '-5 to Die Roll',
      description: 'Reduce any existing trope\'s Intensity or Longevity die by 5 (minimum 2)'
    },
    {
      type: 'subvert' as const,
      name: 'Subvert Trope',
      description: 'Replace a selected trope with its subversion (if available)'
    },
    {
      type: 'rebound' as const,
      name: 'Rebound',
      description: 'Trope is reassigned to a different present target (if available)'
    },
    {
      type: 'balance' as const,
      name: 'Balance in Everything',
      description: 'A self-targeted trope is duplicated on an enemy with the same values'
    },
    {
      type: 'minus2charge' as const,
      name: '-2 Energy',
      description: 'Immediately lose 2 charges (auto-applies, minimum 0)'
    }
  ];

  const randomModifier = modifierTypes[Math.floor(Math.random() * modifierTypes.length)];

  return {
    id: generateId(),
    ...randomModifier,
    dayEarned
  };
};

/**
 * Format charges display (with 1 decimal place)
 */
export const formatCharges = (charges: number): string => {
  return charges.toFixed(1);
};

/**
 * Round to 1 decimal place
 */
export const roundToOneDecimal = (num: number): number => {
  return Math.round(num * 10) / 10;
};
