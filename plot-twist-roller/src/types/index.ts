export interface Roll {
  id: number;
  trope: string;
  category: string;
  die1: number;          // Current value (after rerolls if any)
  die2: number;          // Current value (after rerolls if any)
  die1Original?: number; // Original roll if rerolled from 20 or 1
  die2Original?: number; // Original roll if rerolled from 20 or 1
  intensity: number;
  longevity: number;
  dayApplied: number;
  expired: boolean;
  banked: boolean;
  bankDay?: number;
  appliedTo?: string;
  rerolledFrom1?: boolean;
  rerolledFrom20?: boolean;
}

export type BonusModifierType =
  | 'plus3'        // +3 to dice value (max 19)
  | 'minus5'       // -5 to dice value (min 2)
  | 'reroll'       // Reroll dice
  | 'expire'       // Expire trope
  | 'swap'         // Swap dice values
  | 'permanent'    // Make permanent (set Longevity to 18 - degrading permanent)
  | 'retarget'     // Change target
  | 'plus3charge'  // +3 charges (auto-applies immediately)
  | 'refresh';     // Refresh duration

export interface BonusModifier {
  id: number;
  type: BonusModifierType;
  name: string;
  description: string;
  dayEarned: number;
}

export interface GameState {
  username: string;
  lastSaved: string;
  daysSinceTrigger: number;
  currentCharges: number;
  rolls: Roll[];
  bankedRolls: Roll[];
  bonusModifier: BonusModifier | null;
  activeCategories: { [key: string]: boolean };
}

export interface PendingRoll {
  id: number;
  trope: string;
  category: string;
  description: string;
  die1: number;          // Final value for assignment
  die2: number;          // Final value for assignment
  die1Original?: number; // If rolled 20 or 1
  die2Original?: number; // If rolled 20 or 1
  dayApplied: number;
  rerolledFrom1?: boolean;
  rerolledFrom20?: boolean;
}
