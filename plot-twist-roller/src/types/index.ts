export interface Roll {
  id: number;
  trope: string;
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
  bonusApplied?: boolean; // True if a bonus modifier has been applied to this trope
}

export type BonusModifierType =
  | 'plus5'        // +5 to dice value (max 20)
  | 'permanent'    // Make permanent (set Longevity to 20 - true permanent)
  | 'retarget'     // Change target
  | 'plus3charge'  // +3 charges (auto-applies immediately)
  | 'refresh'      // Refresh duration
  | 'swap'         // Swap dice values between two tropes
  | 'allatonce';   // Set intensity to 20 and longevity to 2

export type ChallengeModifierType =
  | 'expire'       // Expire active trope
  | 'minus5'       // -5 to dice value (min 2)
  | 'subvert'      // Subvert selected trope
  | 'rebound'      // Trope assigned to different present target
  | 'balance'      // Self-targeted trope duplicated on enemy
  | 'minus2charge'; // -2 energy charges

export interface BonusModifier {
  id: number;
  type: BonusModifierType;
  name: string;
  description: string;
  dayEarned: number;
}

export interface ChallengeModifier {
  id: number;
  type: ChallengeModifierType;
  name: string;
  description: string;
  dayEarned: number;
}

export interface TropeFilters {
  target: string;        // Self, Companion, Ally, Enemy, Animal, Object, Area
  situation: string;     // Physical Conflict, Social Conflict, At Rest
  fanserviceEnabled: boolean;
  gender?: string;       // masculine, feminine (only used if fanservice enabled)
  targetName?: string;   // Name of the target (disabled when Self is selected)
}

export interface GameState {
  username: string;
  lastSaved: string;
  daysSinceTrigger: number;
  currentCharges: number;
  rolls: Roll[];
  bankedRolls: Roll[];
  bonusModifier: BonusModifier | null;
  challengeModifier: ChallengeModifier | null;
  filters: TropeFilters;
}

export interface PendingRoll {
  id: number;
  trope: string;
  description: string;
  die1: number;          // Final value for assignment
  die2: number;          // Final value for assignment
  die1Original?: number; // If rolled 20 or 1
  die2Original?: number; // If rolled 20 or 1
  dayApplied: number;
  rerolledFrom1?: boolean;
  rerolledFrom20?: boolean;
}
