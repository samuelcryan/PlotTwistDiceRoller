import { roundToOneDecimal } from './helpers';

/**
 * Calculate energy refund when a trope expires
 * Formula: 1 - ((intensity + longevity) / 40)
 * Round down to nearest tenth (1 decimal place)
 *
 * Examples:
 * - 14/14 power: 1 - (28/40) = 1 - 0.7 = 0.3 charges
 * - 4/4 power: 1 - (8/40) = 1 - 0.2 = 0.8 charges
 * - 19/19 power: 1 - (38/40) = 1 - 0.95 = 0.05 charges (0.1 after rounding)
 * - 2/2 power: 1 - (4/40) = 1 - 0.1 = 0.9 charges
 *
 * Stronger powers return less energy, weaker powers return more.
 */
export const calculateRefund = (intensity: number, longevity: number): number => {
  const refund = 1 - ((intensity + longevity) / 40);
  return Math.max(0, roundToOneDecimal(refund)); // Ensure non-negative
};

/**
 * Calculate refund for banked trope dissipation (after 3 days)
 * Uses same formula as expired trope
 */
export const calculateBankDissipationRefund = (intensity: number, longevity: number): number => {
  return calculateRefund(intensity, longevity);
};

/**
 * Get full refund (for failed trope applications)
 */
export const getFullRefund = (): number => {
  return 1.0;
};
