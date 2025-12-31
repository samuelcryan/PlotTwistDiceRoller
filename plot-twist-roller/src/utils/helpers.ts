import { ALL_TROPES } from '../data/tropes';
import { INTENSITY_SCALE, LONGEVITY_SCALE } from '../data/scales';
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
export const formatEffectDescription = (intensity: number, longevity: number): string => {
  const intensityDesc = INTENSITY_SCALE[intensity];
  const longevityDesc = LONGEVITY_SCALE[longevity];

  if (longevity === 19) {
    return `A ${intensityDesc.toLowerCase()} effect that is permanent (never expires)`;
  } else if (longevity === 18) {
    return `A ${intensityDesc.toLowerCase()} effect that is permanent (degrades)`;
  } else {
    return `A ${intensityDesc.toLowerCase()} effect that lasts ${longevityDesc.toLowerCase()}`;
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
 * Generate a bonus modifier
 */
export const generateBonusModifier = (dayEarned: number) => {
  const modifierTypes = [
    {
      type: 'plus3' as const,
      name: '+3 to Dice Value',
      description: 'Add 3 to any existing trope\'s Intensity or Longevity die (maximum 19)'
    },
    {
      type: 'minus5' as const,
      name: '-5 to Dice Value',
      description: 'Reduce any existing trope\'s Intensity or Longevity die by 5 (minimum 2)'
    },
    {
      type: 'reroll' as const,
      name: 'Reroll Dice',
      description: 'Reroll either the Intensity or Longevity die of any active trope'
    },
    {
      type: 'expire' as const,
      name: 'Expire Trope',
      description: 'Immediately end any active trope regardless of remaining duration'
    },
    {
      type: 'swap' as const,
      name: 'Swap Dice Values',
      description: 'Exchange the Intensity and Longevity values of any active trope'
    },
    {
      type: 'permanent' as const,
      name: 'Make Permanent',
      description: 'Set any trope\'s Longevity value to 18 (permanent but degrading)'
    },
    {
      type: 'retarget' as const,
      name: 'Change Target',
      description: 'Move a trope from its current target to a different valid target'
    },
    {
      type: 'plus3charge' as const,
      name: '+3 Charges',
      description: 'Immediately restore 3 charges (auto-applies, up to maximum capacity)'
    },
    {
      type: 'refresh' as const,
      name: 'Refresh Duration',
      description: 'Reset any trope\'s duration timer to its original Longevity value'
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
