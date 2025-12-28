// Unified trope data structure - single source of truth
export interface TropeData {
  name: string;
  category: string;
  description: string;
}

export const ALL_TROPES: TropeData[] = [
  // EXTREME COMBAT - Offensive Power
  {
    name: "Death from Above",
    category: "Extreme Combat",
    description: "Attacks launched from elevated positions or while airborne. Gravity and momentum add devastating force to strikes from above."
  },
  {
    name: "Eye Beam",
    category: "Extreme Combat",
    description: "Projected energy or laser blasts emanating directly from the eyes. Classic superhero attack requiring no hand gestures."
  },
  {
    name: "Sword Beam",
    category: "Extreme Combat",
    description: "Energy projectiles launched by swinging a blade through the air. Melee weapon gains ranged attack capability."
  },
  {
    name: "Chain Lightning",
    category: "Extreme Combat",
    description: "Electrical attack that arcs from one target to multiple others in sequence. More targets means broader but weaker effect per individual."
  },
  {
    name: "Spam Attack",
    category: "Extreme Combat",
    description: "Overwhelming barrage of rapid-fire strikes sacrificing individual power for volume. Death by a thousand cuts approach to combat."
  },
  {
    name: "Death of a Thousand Cuts",
    category: "Extreme Combat",
    description: "Accumulation of numerous minor injuries that collectively become severe. No single wound is dangerous, but together they're lethal."
  },
  {
    name: "Clone Army",
    category: "Extreme Combat",
    description: "Creation of multiple duplicates of oneself for overwhelming numerical advantage. Quality of copies varies with intensity."
  },
  {
    name: "Razor Wind",
    category: "Extreme Combat",
    description: "Slashing attacks made of compressed air or wind. Can cut from a distance without physical contact."
  },
  {
    name: "Ground Pound",
    category: "Extreme Combat",
    description: "Devastating shockwave attack by striking the ground with tremendous force. Affects large area around impact point."
  },
  {
    name: "Improbable Aiming Skills",
    category: "Extreme Combat",
    description: "Superhuman accuracy with projectiles or ranged attacks. Can make seemingly impossible shots consistently."
  },
  {
    name: "Lightning Bruiser",
    category: "Extreme Combat",
    description: "Combination of overwhelming strength and surprising speed. Appears too fast for someone so powerful."
  },
  {
    name: "Stone Wall",
    category: "Extreme Combat",
    description: "Nearly impenetrable defense but limited offensive capability. Extremely difficult to harm or move."
  },
  {
    name: "Rocket Punch",
    category: "Extreme Combat",
    description: "Fist or limb launches as a projectile attack. Can be recalled or regrown depending on intensity."
  },
  {
    name: "Super-Breath",
    category: "Extreme Combat",
    description: "Exhale with tremendous force, able to blow objects away or freeze targets. Intensity determines power and range."
  },

  // EXTREME COMBAT - Defensive Power
  {
    name: "Barrier Warrior",
    category: "Extreme Combat",
    description: "Specialization in creating and maintaining defensive barriers to protect self or allies. Defense is the best offense."
  },
  {
    name: "Attack Reflector",
    category: "Extreme Combat",
    description: "Redirects incoming attacks back toward their source. Enemy's own power becomes their downfall."
  },
  {
    name: "Intangible Man",
    category: "Extreme Combat",
    description: "Ability to become incorporeal and pass through solid matter. Physical attacks pass harmlessly through."
  },
  {
    name: "Super-Toughness",
    category: "Extreme Combat",
    description: "Dramatically increased resistance to physical damage and injury. Body can withstand impacts that would destroy normal humans."
  },
  {
    name: "Last Chance Hit Point",
    category: "Extreme Combat",
    description: "Protection against fatal damage that would otherwise end the fight immediately. Survives with minimal health remaining instead of death."
  },
  {
    name: "Auto-Revive",
    category: "Extreme Combat",
    description: "Automatic return from death or incapacitation one time. Second chance at survival when defeated."
  },
  {
    name: "Adaptive Armor",
    category: "Extreme Combat",
    description: "Protection that adjusts to counter whatever damaged it last. Becomes progressively more effective against repeated attack types."
  },
  {
    name: "Force Field",
    category: "Extreme Combat",
    description: "Barrier of energy that blocks incoming harm. Strength and size depend on intensity roll."
  },
  {
    name: "Last Stand",
    category: "Extreme Combat",
    description: "When near defeat, gain temporary surge of defensive capability. Only activates at critical moments."
  },
  {
    name: "Pocket Dimension",
    category: "Extreme Combat",
    description: "Small dimensional space for storage or brief shelter. Size and duration vary with rolls."
  },

  // EXTREME COMBAT - Ultimate Abilities
  {
    name: "The Ace",
    category: "Extreme Combat",
    description: "Displays exceptional competence and skill across all relevant capabilities. Natural talent makes difficult tasks look effortless."
  },
  {
    name: "Infinity +1 Sword",
    category: "Extreme Combat",
    description: "Acquisition of the ultimate weapon or tool for the situation. Legendary implement of overwhelming power."
  },
  {
    name: "Heroic Resolve",
    category: "Extreme Combat",
    description: "Unwavering determination to continue fighting despite overwhelming adversity. Willpower allows pushing past normal limits."
  },
  {
    name: "Heroic Second Wind",
    category: "Extreme Combat",
    description: "Sudden recovery of stamina and capability after apparent exhaustion. Found new strength when it seemed depleted."
  },
  {
    name: "Heroic Willpower",
    category: "Extreme Combat",
    description: "Pure force of will overcomes mental attacks, fear, or compulsion. Mind proves stronger than external influence."
  },
  {
    name: "Born Lucky",
    category: "Extreme Combat",
    description: "Innate tendency for fortunate circumstances and favorable outcomes. Luck itself seems to favor the target."
  },
  {
    name: "Probability Manipulation",
    category: "Extreme Combat",
    description: "Direct influence over likelihood of outcomes and random chance. Make improbable events more likely to occur."
  },
  {
    name: "You Are Already Dead",
    category: "Extreme Combat",
    description: "Target has been dealt a fatal blow but hasn't realized it yet. Delayed effect creates dramatic tension before inevitable collapse."
  },
  {
    name: "Combat Breakdown",
    category: "Extreme Combat",
    description: "Structured combat deteriorates into chaotic, desperate struggle. Technique abandoned in favor of raw survival instinct."
  },
  {
    name: "Powers Do the Fighting",
    category: "Extreme Combat",
    description: "Powers operate autonomously while wielder remains stationary or passive. Abilities act independently of conscious direction."
  },
  {
    name: "Critical Status Buff",
    category: "Extreme Combat",
    description: "Power and capability increase proportionally as health decreases. Desperation unlocks greater strength."
  },
  {
    name: "With My Hands Tied",
    category: "Extreme Combat",
    description: "Full combat effectiveness maintained despite physical restraints or limitations. Bonds don't reduce fighting capability."
  },
  {
    name: "The Worf Barrage",
    category: "Extreme Combat",
    description: "Deliberately withstanding devastating attack to demonstrate superior durability. Taking the hit to prove toughness."
  },

  // EXTREME COMBAT - Transformation
  {
    name: "Heroic Build",
    category: "Extreme Combat",
    description: "Body transforms to display idealized muscular and powerful physique. Instant bodybuilder aesthetic."
  },
  {
    name: "Red Eyes, Take Warning",
    category: "Extreme Combat",
    description: "Eyes become crimson red as visual indicator of danger or power activation. Classic warning sign of enhanced threat."
  },
  {
    name: "Became Their Own Antithesis",
    category: "Extreme Combat",
    description: "Transformation into the polar opposite of previous nature or beliefs. Complete reversal of core characteristics."
  },
  {
    name: "Took a Level in Badass",
    category: "Extreme Combat",
    description: "Sudden dramatic increase in competence and capability. Previously weak character becomes formidable."
  },

  // EXTREME COMBAT - Time & Space
  {
    name: "Bullet Time",
    category: "Extreme Combat",
    description: "Perception of time slows dramatically while maintaining normal movement speed. World moves in slow motion relative to user."
  },
  {
    name: "Time Skip",
    category: "Extreme Combat",
    description: "Instant temporal displacement forward, skipping intervening duration. Emerge at future moment without experiencing the time between."
  },
  {
    name: "Year Inside, Hour Outside",
    category: "Extreme Combat",
    description: "Dramatic time flow discrepancy where much more time passes in one location than another. Relative temporal speeds differ greatly."
  },
  {
    name: "Teleport Spam",
    category: "Extreme Combat",
    description: "Rapid successive short-range teleportation creating unpredictable movement. Chain of instant spatial jumps."
  },

  // EXTREME COMBAT - Tactical
  {
    name: "Flash Step",
    category: "Extreme Combat",
    description: "Extremely rapid short-distance movement that appears like teleportation. Limited range but near-instantaneous."
  },
  {
    name: "Afterimage",
    category: "Extreme Combat",
    description: "Movement leaves behind visual copies that confuse enemies. More intense rolls create more convincing duplicates."
  },
  {
    name: "Smoke Out",
    category: "Extreme Combat",
    description: "Generate obscuring cloud for escape or concealment. Can be smoke, fog, or other vision-blocking effect."
  },
  {
    name: "Tactical Rock-Paper-Scissors",
    category: "Extreme Combat",
    description: "Advantage against specific power types but weakness to others. Effectiveness depends on matchup."
  },
  {
    name: "Combat Pragmatist",
    category: "Extreme Combat",
    description: "Willingness and ability to fight dirty effectively. No move is too underhanded if it works."
  },
  {
    name: "Danger Sense",
    category: "Extreme Combat",
    description: "Intuitive warning of incoming threats. Strength affects how much advance warning and detail provided."
  },
  {
    name: "Second Wind",
    category: "Extreme Combat",
    description: "Recovery of energy or capability after initial exhaustion. Can turn the tide when stamina runs low."
  },

  // COMBAT - Offensive
  {
    name: "Back Stab",
    category: "Combat",
    description: "Devastating strike delivered from behind enemy's guard. Attacking vulnerable rear position for maximum damage."
  },
  {
    name: "Deadly Disc",
    category: "Combat",
    description: "Razor-sharp spinning disc hurled as projectile. Circular blade cuts through targets."
  },
  {
    name: "Finger Gun",
    category: "Combat",
    description: "Hand gesture of pointing finger becomes actual weapon firing projectiles. Simple gesture gains deadly functionality through power manifestation."
  },
  {
    name: "The Paralyzer",
    category: "Combat",
    description: "Attack that immobilizes target without dealing significant damage. Freezes enemy in place."
  },
  {
    name: "A Handful for an Eye",
    category: "Combat",
    description: "Throwing sand, dirt, or other irritants into opponent's eyes to blind and distract. Classic dirty fighting tactic."
  },
  {
    name: "Throw the Mook at Them",
    category: "Combat",
    description: "Use enemies or objects as improvised projectiles against other foes. Particularly effective with enhanced strength."
  },
  {
    name: "Punch Parry",
    category: "Combat",
    description: "Block or deflect incoming attacks with precise counters. Can damage weapons or harm attackers on successful defense."
  },
  {
    name: "Rapid-Fire Fisticuffs",
    category: "Combat",
    description: "Unleash flurry of strikes in quick succession. Individual hits weak but cumulative damage significant."
  },
  {
    name: "Punch a Wall",
    category: "Combat",
    description: "Ability to damage or destroy barriers and obstacles with physical strikes. Effectiveness varies with intensity."
  },
  {
    name: "Power Fist",
    category: "Combat",
    description: "One or both hands gain enhanced striking capability. Can be energy-based, enlarged, or simply reinforced."
  },

  // COMBAT - Defensive
  {
    name: "Healing Hands",
    category: "Combat",
    description: "Physical contact allows transfer of healing energy to repair injuries. Touch to cure wounds."
  },
  {
    name: "Spider-Sense",
    category: "Combat",
    description: "Precognitive awareness of incoming threats and danger. Tingling warning of imminent harm."
  },
  {
    name: "Super-Speed",
    category: "Combat",
    description: "Dramatically enhanced movement velocity far exceeding normal limits. Blur of motion nearly too fast to track."
  },
  {
    name: "Roll Away",
    category: "Combat",
    description: "Enhanced dodging through tumbling and acrobatic movement. Makes character harder to pin down or hit."
  },
  {
    name: "Armor Is Useless",
    category: "Combat",
    description: "Protection becomes irrelevant, either bypassing it or making it ineffective. Works on both physical and power-based defenses."
  },
  {
    name: "Bulletproof Human Shield",
    category: "Combat",
    description: "Using cover (object or person) that can withstand incoming fire. May work better than expected."
  },
  {
    name: "The Last Dance",
    category: "Combat",
    description: "Fighting ability increases proportionally to injuries sustained. Becomes more dangerous when wounded."
  },
  {
    name: "Willfully Weak",
    category: "Combat",
    description: "Deliberately holding back power or skill. Can be released when truly necessary."
  },

  // COMBAT - Movement & Positioning
  {
    name: "Wall Crawl",
    category: "Combat",
    description: "Ability to adhere to and traverse vertical surfaces and ceilings. Walk on walls as easily as floors."
  },
  {
    name: "Super-Jump",
    category: "Combat",
    description: "Jump to heights and distances far beyond normal human capability. Single bound covers vast distance."
  },
  {
    name: "Roof Hopping",
    category: "Combat",
    description: "Travel by leaping from rooftop to rooftop with parkour expertise. Urban high-ground navigation."
  },
  {
    name: "Grappling-Hook Pistol",
    category: "Combat",
    description: "Device that fires grappling hook for rapid vertical traversal. Mechanical assistance for scaling buildings."
  },
  {
    name: "Double Jump",
    category: "Combat",
    description: "Ability to perform second jump while airborne without solid surface. Video game physics made real."
  },
  {
    name: "Ceiling Cling",
    category: "Combat",
    description: "Adhere to and hang from overhead surfaces. Spider-like attachment to ceilings."
  },
  {
    name: "No Escape but Down",
    category: "Combat",
    description: "Situation where only viable exit requires going to lower elevation. Trapped with down as sole option."
  },

  // COMBAT - Tactical
  {
    name: "Crazy-Prepared",
    category: "Combat",
    description: "Possesses exactly the right tool or plan for any situation no matter how unlikely. Prepared for every contingency."
  },
  {
    name: "The Strategist",
    category: "Combat",
    description: "Exceptional tactical and strategic thinking ability. Can formulate complex plans rapidly."
  },
  {
    name: "Chekhov's Skill",
    category: "Combat",
    description: "Previously mentioned capability suddenly becomes crucial to current situation. Established skill proves relevant."
  },
  {
    name: "Luckily, My Shield Will Protect Me",
    category: "Combat",
    description: "Defense appears or activates at precisely the right moment. Perfectly timed protection."
  },
  {
    name: "Combat Parkour",
    category: "Combat",
    description: "Integration of parkour movement into combat for enhanced mobility. Acrobatic warfare."
  },
  {
    name: "Fights Like a Normal",
    category: "Combat",
    description: "Despite possessing powers, relies primarily on ordinary combat skills. Eschews abilities for conventional methods."
  },
  {
    name: "Damage-Increasing Debuff",
    category: "Combat",
    description: "Status effect that amplifies all incoming harm to afflicted target. Vulnerability to damage increased."
  },
  {
    name: "Status-Buff Dispel",
    category: "Combat",
    description: "Ability to strip away beneficial enhancements from opponents. Nullification of enemy advantages."
  },
  {
    name: "Choke Holds",
    category: "Combat",
    description: "Specialized grappling techniques that restrict breathing or blood flow. Submission through controlled strangulation."
  },
  {
    name: "Combat Commentator",
    category: "Combat",
    description: "Provides running commentary on ongoing combat as it happens. Real-time analysis and narration of battle."
  },
  {
    name: "Annoying Arrows",
    category: "Combat",
    description: "Arrow wounds prove superficial and easily extracted without serious consequence. Projectiles more irritating than dangerous. Note: Also applies to low caliber bullets."
  },
  {
    name: "Confusion Fu",
    category: "Combat",
    description: "Completely unpredictable fighting style that's difficult to counter. Randomness itself becomes the strategy."
  },
  {
    name: "Weak but Skilled",
    category: "Combat",
    description: "Limited raw power compensated by superior technique and timing. Efficiency over brute force."
  },
  {
    name: "Fighting Dirty",
    category: "Combat",
    description: "Using unconventional tactics like eye gouges, groin strikes, and sand throwing. Anything goes."
  },
  {
    name: "Pressure Point",
    category: "Combat",
    description: "Knowledge of vulnerable spots that cause disproportionate effects. Small precise strikes create major impact."
  },
  {
    name: "Deadly Dodging",
    category: "Combat",
    description: "Evasive movement causes enemies to hit each other or obstacles. Turning defense into indirect offense."
  },
  {
    name: "Close-Range Combatant",
    category: "Combat",
    description: "Exceptional effectiveness in melee distance. May have weakness at range."
  },
  {
    name: "Long-Range Fighter",
    category: "Combat",
    description: "Specialized in keeping distance from opponents. Struggles if enemies close in."
  },
  {
    name: "Pinned to the Wall",
    category: "Combat",
    description: "Ability to immobilize targets by securing them to surfaces. Duration depends on intensity."
  },
  {
    name: "Catch and Return",
    category: "Combat",
    description: "Intercept projectiles and send them back at attacker. Requires good timing and positioning."
  },

  // COMBAT - Weapons & Equipment
  {
    name: "Pillow Pistol",
    category: "Combat",
    description: "Weapon concealed under pillow for immediate access. Always perfectly positioned when needed."
  },
  {
    name: "Cool Sword",
    category: "Combat",
    description: "Impressive blade with exceptional qualities. Superior craftsmanship and effectiveness."
  },
  {
    name: "Swiss-Army Weapon",
    category: "Combat",
    description: "Multi-purpose tool or weapon with numerous functions. Single item serves many roles."
  },
  {
    name: "Trick Arrow",
    category: "Combat",
    description: "Specialized arrows with unique effects beyond simple projectiles. Each arrow has different capability."
  },
  {
    name: "Automatic Crossbows",
    category: "Combat",
    description: "Self-loading crossbow mechanism. Eliminates reload time between shots."
  },
  {
    name: "Bottomless Magazines",
    category: "Combat",
    description: "Ammunition supply that never runs out. Infinite ammo without reloading."
  },
  {
    name: "Utility Belt",
    category: "Combat",
    description: "Tool-carrying belt with exactly what's needed. Conveniently organized equipment."
  },

  // COMBAT - Environmental
  {
    name: "Hammerspace",
    category: "Combat",
    description: "Objects appear from nowhere when needed. Extradimensional storage accessed instantly."
  },
  {
    name: "Maze of Doom",
    category: "Combat",
    description: "Complex labyrinth that traps and confounds opponents. Navigation becomes deadly challenge."
  },
  {
    name: "Ominous Fog",
    category: "Combat",
    description: "Threatening mist appears to obscure visibility and create atmosphere. Dense fog limits sight."
  },
  {
    name: "Deadly Training Area",
    category: "Combat",
    description: "Practice environment becomes genuinely dangerous. Safety protocols fail at worst time."
  },
  {
    name: "Dramatic Thunder",
    category: "Combat",
    description: "Ominous weather effects emphasize dramatic moments. Thunder punctuates important events."
  },
  {
    name: "Dramatic Wind",
    category: "Combat",
    description: "Wind appears at dramatically appropriate moments. Breeze knows when to blow for effect."
  },

  // COMBAT - Powers
  {
    name: "X-Ray Vision",
    category: "Combat",
    description: "Ability to see through solid objects. Perceive what's hidden behind walls or containers."
  },
  {
    name: "Super-Senses",
    category: "Combat",
    description: "All senses enhanced beyond normal human limits. Heightened perception of environment."
  },
  {
    name: "All-Seeing Eye",
    category: "Combat",
    description: "Comprehensive visual perception of surroundings. Can observe everything simultaneously."
  },
  {
    name: "Anti-Gravity",
    category: "Combat",
    description: "Negation or control of gravitational forces. Objects become weightless or gravity-defying."
  },
  {
    name: "Supernatural Martial Arts",
    category: "Combat",
    description: "Fighting style incorporating impossible or magical techniques. Transcends normal physical limits."
  },

  // SOCIAL - Positive Traits
  {
    name: "Magnetic Hero",
    category: "Social",
    description: "Naturally attracts allies and followers. People want to join their cause."
  },
  {
    name: "The Heart",
    category: "Social",
    description: "Emotional center that holds group together. Provides moral compass and motivation."
  },
  {
    name: "Charm Person",
    category: "Social",
    description: "Naturally likeable and charismatic. People instinctively trust and want to help."
  },
  {
    name: "Fire-Forged Friends",
    category: "Social",
    description: "Bonds formed through shared danger strengthen dramatically. Adversity creates deep connections."
  },
  {
    name: "True Companions",
    category: "Social",
    description: "Unbreakable bonds of loyalty and friendship. Will support each other no matter what."
  },
  {
    name: "Vitriolic Best Buds",
    category: "Social",
    description: "Constantly bicker and argue but deeply care for each other. Insults are love language."
  },
  {
    name: "Found Family",
    category: "Social",
    description: "Chosen family bonds as strong as blood relations. Created kinship through shared experience."
  },
  {
    name: "Band of Brothers",
    category: "Social",
    description: "Deep camaraderie from fighting together. Military-style brotherhood."
  },
  {
    name: "Big Brother Instinct",
    category: "Social",
    description: "Overwhelming protective feelings toward others. Compulsion to shield from harm."
  },
  {
    name: "Adopted to the House",
    category: "Social",
    description: "Outsider becomes accepted family member. Fully integrated into new family unit."
  },
  {
    name: "Friendly Rival",
    category: "Social",
    description: "Competition mixed with genuine friendship. Push each other to improve."
  },
  {
    name: "Odd Friendship",
    category: "Social",
    description: "Unlikely pair becomes close friends despite differences. Shouldn't work but does."
  },
  {
    name: "Took a Level in Kindness",
    category: "Social",
    description: "Character becomes noticeably nicer and more compassionate. Personality softens."
  },
  {
    name: "The Pollyanna",
    category: "Social",
    description: "Maintains optimism even in dire circumstances. Infectious positivity despite adversity."
  },
  {
    name: "Team Mom",
    category: "Social",
    description: "Nurturing, organizing role in group dynamics. Others turn to them for support."
  },
  {
    name: "Team Dad",
    category: "Social",
    description: "Protective and authoritative group presence. Provides structure and discipline."
  },
  {
    name: "Big Brother Mentor",
    category: "Social",
    description: "Teaching role toward less experienced person. Protective without being overbearing."
  },
  {
    name: "Worth Living For",
    category: "Social",
    description: "Becomes someone's reason to continue. Inspires others to persevere."
  },
  {
    name: "Undying Loyalty",
    category: "Social",
    description: "Unshakeable devotion to person or cause. Will not betray under any pressure."
  },

  // SOCIAL - Negative Traits
  {
    name: "The Dreaded",
    category: "Social",
    description: "Everyone fears this person instinctively. Reputation precedes them."
  },
  {
    name: "Brutal Honesty",
    category: "Social",
    description: "Says truth regardless of social consequences. No filter or tact."
  },
  {
    name: "Cannot Tell a Lie",
    category: "Social",
    description: "Physically or psychologically incapable of lying. Must speak truth."
  },
  {
    name: "Cannot Keep a Secret",
    category: "Social",
    description: "Compulsively reveals confidential information. Secrets spill out uncontrollably."
  },
  {
    name: "Walking Disaster Area",
    category: "Social",
    description: "Causes chaos and accidents wherever they go. Destruction follows naturally."
  },
  {
    name: "Weirdness Magnet",
    category: "Social",
    description: "Strange events and people drawn to them. Normalcy impossible."
  },
  {
    name: "The Klutz",
    category: "Social",
    description: "Constantly clumsy and accident-prone. Trips, drops things, bumps into objects."
  },
  {
    name: "Lethally Stupid",
    category: "Social",
    description: "Dangerously idiotic decisions endanger everyone. Stupidity becomes threat."
  },
  {
    name: "No Social Skills",
    category: "Social",
    description: "Difficulty reading situations or responding appropriately. Social cues missed consistently."
  },
  {
    name: "Sarcasm Failure",
    category: "Social",
    description: "Attempts at sarcasm taken literally or fall flat. Creates awkward misunderstandings."
  },
  {
    name: "Lord Error-Prone",
    category: "Social",
    description: "Well-meaning but causes problems through mistakes. Competent except socially."
  },
  {
    name: "Glory Hound",
    category: "Social",
    description: "Excessive desire for recognition and credit. Takes unnecessary risks for fame."
  },
  {
    name: "It's All About Me",
    category: "Social",
    description: "Centers every situation on themselves. Others' needs invisible to them."
  },

  // SOCIAL - Perception & Reputation
  {
    name: "Living Legend",
    category: "Social",
    description: "Famous reputation precedes them everywhere. Known by all."
  },
  {
    name: "Establishing Character Moment",
    category: "Social",
    description: "Single action defines how others perceive them. First impression becomes lasting."
  },
  {
    name: "Ignored Expert",
    category: "Social",
    description: "Correct advice consistently dismissed. Being right doesn't mean being heard."
  },
  {
    name: "Instantly Proven Wrong",
    category: "Social",
    description: "Statements immediately contradicted by events. Universe loves irony."
  },
  {
    name: "Mistaken Identity",
    category: "Social",
    description: "Confused for someone else entirely. Wrong person, wrong place."
  },
  {
    name: "Informed Attractiveness",
    category: "Social",
    description: "Others constantly comment on beauty. Appearance emphasized by reactions."
  },
  {
    name: "Wrong Genre Savvy",
    category: "Social",
    description: "Thinks wrong narrative rules apply. Confident but incorrect assumptions."
  },
  {
    name: "Mistaken for Badass",
    category: "Social",
    description: "Others believe more dangerous than reality. Reputation exceeds capability."
  },
  {
    name: "Underestimated",
    category: "Social",
    description: "Regularly dismissed despite actual competence. Others learn mistake too late."
  },
  {
    name: "Everyone Has Standards",
    category: "Social",
    description: "Even flexible people have lines they won't cross. Unexpected moral boundaries."
  },

  // SOCIAL - Relationship Changes
  {
    name: "Heel-Face Turn",
    category: "Social",
    description: "Villain becomes hero. Alignment shift to good."
  },
  {
    name: "Face-Heel Turn",
    category: "Social",
    description: "Hero becomes villain. Fall from grace."
  },
  {
    name: "Sitcom Arch-Nemesis",
    category: "Social",
    description: "Minor persistent annoyance rather than serious threat. Comedic antagonism."
  },
  {
    name: "Redemption Quest",
    category: "Social",
    description: "Seeking to make amends for past wrongs. Active path to atonement."
  },
  {
    name: "Jerkass Realization",
    category: "Social",
    description: "Suddenly aware of own awful behavior. Recognition of being terrible."
  },

  // SOCIAL - Romance & Affection
  {
    name: "Aw, Look! They Really Do Love Each Other",
    category: "Social",
    description: "Hidden affection finally revealed. Caring shown despite denials."
  },
  {
    name: "Cannot Spit It Out",
    category: "Social",
    description: "Unable to confess romantic feelings. Words won't come."
  },
  {
    name: "Oblivious to Love",
    category: "Social",
    description: "Doesn't notice others' romantic interest. Attraction invisible to them."
  },
  {
    name: "The Power of Love",
    category: "Social",
    description: "Love provides literal strength and capability. Caring becomes power."
  },

  // SOCIAL - Communication
  {
    name: "Speaks Fluent Animal",
    category: "Social",
    description: "Can communicate with animals verbally. Understands and speaks their languages."
  },
  {
    name: "Translator Microbes",
    category: "Social",
    description: "Automatic comprehension of all languages. Universal understanding without study."
  },
  {
    name: "Universal Translator",
    category: "Social",
    description: "Device that translates any language instantly. Technology enables communication."
  },
  {
    name: "Voice Changeling",
    category: "Social",
    description: "Perfectly mimic any voice heard. Vocal impersonation without detection."
  },
  {
    name: "Ventriloquism",
    category: "Social",
    description: "Throw voice to appear from different location. Sound misdirection."
  },
  {
    name: "Closed Door Rapport",
    category: "Social",
    description: "Meaningful connection through physical barrier. Door doesn't prevent understanding."
  },
  {
    name: "Landline Eavesdropping",
    category: "Social",
    description: "Secretly listening to phone conversations. Covert interception of calls."
  },
  {
    name: "Little Old Lady Investigates",
    category: "Social",
    description: "Elderly person solving mysteries. Age and appearance hide detective work."
  },
  {
    name: "Lie Detector",
    category: "Social",
    description: "Know when others are lying. Deception becomes obvious."
  },
  {
    name: "Glasses Curiosity",
    category: "Social",
    description: "Interest in or significance of eyewear. Glasses draw attention."
  },
  {
    name: "Voluntary Vassal",
    category: "Social",
    description: "Chooses to serve and be subordinate. Willing loyalty to authority."
  },
  {
    name: "Bad Good Girl",
    category: "Social",
    description: "Acts good but with edge or attitude. Righteousness with bite."
  },
  {
    name: "Cultured Badass",
    category: "Social",
    description: "Refined and dangerous simultaneously. Sophistication meets capability."
  },
  {
    name: "Hidden Depths",
    category: "Social",
    description: "More complex than initial appearance suggests. Layers beneath surface."
  },
  {
    name: "Book Dumb",
    category: "Social",
    description: "Street-smart but not academically inclined. Practical intelligence over education."
  },
  {
    name: "Genius Bruiser",
    category: "Social",
    description: "Combines intelligence with physical strength. Smart and strong."
  },
  {
    name: "Cuddle Bug",
    category: "Social",
    description: "Enjoys physical affection and closeness. Seeks hugs and contact."
  },
  {
    name: "Cuteness Proximity",
    category: "Social",
    description: "Melts around cute things. Adorableness breaks composure."
  },
  {
    name: "Crowd Pleaser",
    category: "Social",
    description: "Motivated by praise and recognition. Approval drives behavior."
  },
  {
    name: "Creature of Habit",
    category: "Social",
    description: "Strongly prefers routine and predictability. Change causes distress."
  },
  {
    name: "Drink-Based Characterization",
    category: "Social",
    description: "Personality revealed through beverage choices. Drinks define character."
  },
  {
    name: "Disco Dan",
    category: "Social",
    description: "Stuck in past era culturally. References and style outdated."
  },
  {
    name: "Bunny-Ears Lawyer",
    category: "Social",
    description: "Bizarre but highly competent. Eccentricity doesn't reduce effectiveness."
  },
  {
    name: "Cloudcuckoolander",
    category: "Social",
    description: "Delightfully weird and eccentric. Lives in own reality."
  },
  {
    name: "Homeschooled Kids",
    category: "Social",
    description: "Educated outside traditional school system. Different socialization."
  },
  {
    name: "The Empath",
    category: "Social",
    description: "Sense and understand others' emotions directly. Feel what others feel."
  },
  {
    name: "The Power of Friendship",
    category: "Social",
    description: "Allies provide tangible strength. Bonds become power."
  },
  {
    name: "Cryptic Conversation",
    category: "Social",
    description: "Speaks in riddles and vague statements. Clarity deliberately avoided."
  },
  {
    name: "Sesquipedalian Loquaciousness",
    category: "Social",
    description: "Uses unnecessarily complex words. Verbose and pretentious speech."
  },
  {
    name: "Blunt Metaphors Trauma",
    category: "Social",
    description: "Describes trauma casually and crudely. Disturbing delivery disconnect."
  },
  {
    name: "Verbal Tic",
    category: "Social",
    description: "Recurring speech pattern or repeated phrase. Distinctive speaking quirk."
  },
  {
    name: "The Quiet One",
    category: "Social",
    description: "Speaks rarely but meaningfully. Silence is default, words carry weight."
  },
  {
    name: "Motor Mouth",
    category: "Social",
    description: "Talks constantly and rapidly. Difficulty stopping once started."
  },

  // ISOLATED - Physical Appearance
  {
    name: "Statuesque Stunner",
    category: "Isolated",
    description: "Very tall and striking appearance. Height adds to attractiveness."
  },
  {
    name: "Cute Clumsy Girl",
    category: "Isolated",
    description: "Endearingly awkward and accident-prone. Clumsiness is charming."
  },
  {
    name: "Hartman Hips",
    category: "Isolated",
    description: "Notably wider hips. Distinctive body shape."
  },
  {
    name: "Lantern Jaw of Justice",
    category: "Isolated",
    description: "Strong, prominent jawline. Heroic facial structure."
  },
  {
    name: "Perma-Stubble",
    category: "Isolated",
    description: "Constant five o'clock shadow. Facial hair perpetually at stubble length."
  },
  {
    name: "Rapunzel Hair",
    category: "Isolated",
    description: "Extremely long hair. Length defies practicality."
  },
  {
    name: "You Gotta Have Blue Hair",
    category: "Isolated",
    description: "Unusual or impossible natural hair color. Vibrant non-standard hues."
  },
  {
    name: "Supernatural Gold Eyes",
    category: "Isolated",
    description: "Glowing or golden eyes indicating power. Luminous gaze."
  },
  {
    name: "Monochromatic Eyes",
    category: "Isolated",
    description: "Single-color eyes without distinct iris. Uniform eye coloration."
  },
  {
    name: "Pointy Ears",
    category: "Isolated",
    description: "Elf-like pointed ear shape. Non-human ear structure."
  },
  {
    name: "Hidden Buxom",
    category: "Isolated",
    description: "Large chest concealed by clothing. Size not immediately apparent."
  },
  {
    name: "The Most Common Superpower",
    category: "Isolated",
    description: "Gravity-defying proportions. Physics-breaking curves."
  },
  {
    name: "Gender Bender",
    category: "Isolated",
    description: "Sex change occurs. Male becomes female or vice versa."
  },
  {
    name: "Strong Family Resemblance",
    category: "Isolated",
    description: "Striking similarity to relative. Family connection obvious."
  },
  {
    name: "Weird Beard",
    category: "Isolated",
    description: "Unusual facial hair in improbable style. Defies grooming norms."
  },
  {
    name: "Messy Hair",
    category: "Isolated",
    description: "Perpetually unkempt hair. Resists all styling attempts."
  },
  {
    name: "Alluring Anglerfish",
    category: "Isolated",
    description: "Attractive feature hiding something else. Beauty as distraction."
  },
  {
    name: "Facial Horror",
    category: "Isolated",
    description: "Disturbing or damaged facial features. Unsettling appearance."
  },

  // ISOLATED - Appearance Effects
  {
    name: "The Beautiful Elite",
    category: "Isolated",
    description: "Becomes unnaturally attractive. Beauty beyond normal human range."
  },
  {
    name: "Glamour",
    category: "Isolated",
    description: "Magical beauty or disguise. Supernatural appearance enhancement."
  },
  {
    name: "Hollywood Homely",
    category: "Isolated",
    description: "Considered unattractive despite not being so. Informed unattractiveness."
  },
  {
    name: "Ugly Cute",
    category: "Isolated",
    description: "Adorable despite odd appearance. Unconventional cuteness."
  },
  {
    name: "Uncanny Valley",
    category: "Isolated",
    description: "Slightly off, unsettling appearance. Almost human but wrong."
  },
  {
    name: "Walking Shirtless Scene",
    category: "Isolated",
    description: "Compulsion to remove shirt. Upper body frequently exposed."
  },
  {
    name: "The Eeyore",
    category: "Isolated",
    description: "Perpetually gloomy expression and demeanor. Default depression."
  },

  // ISOLATED - Identity
  {
    name: "Shapeshifter",
    category: "Isolated",
    description: "Can change physical form. Transformation ability."
  },
  {
    name: "Voluntary Shapeshifting",
    category: "Isolated",
    description: "Controlled transformation at will. Deliberate form changes."
  },
  {
    name: "Doppelgänger",
    category: "Isolated",
    description: "Exact duplicate appears. Perfect copy exists."
  },
  {
    name: "Literal Split Personality",
    category: "Isolated",
    description: "Multiple personalities in separate bodies. Divided self made physical."
  },
  {
    name: "Jekyll & Hyde",
    category: "Isolated",
    description: "Alternate personality emerges. Dual nature manifests."
  },

  // ISOLATED - Mental States
  {
    name: "Heroic BSoD",
    category: "Isolated",
    description: "Mental breakdown from overwhelming stress. Blue screen of death for people."
  },
  {
    name: "Sanity Slippage",
    category: "Isolated",
    description: "Gradual loss of mental stability. Slow descent into madness."
  },
  {
    name: "Despair Event Horizon",
    category: "Isolated",
    description: "Point of giving up completely. All hope lost."
  },
  {
    name: "Break the Cutie",
    category: "Isolated",
    description: "Innocent person becomes traumatized. Purity destroyed by experience."
  },
  {
    name: "Rage Breaking Point",
    category: "Isolated",
    description: "Finally snap from accumulated anger. Patience runs out explosively."
  },
  {
    name: "Tranquil Fury",
    category: "Isolated",
    description: "Calm but deadly anger. Quiet rage more dangerous than shouting."
  },
  {
    name: "Ax-Crazy",
    category: "Isolated",
    description: "Violent insanity. Dangerous madness."
  },
  {
    name: "Berserk Button",
    category: "Isolated",
    description: "Specific trigger causes rage. Particular subject enrages instantly."
  },
  {
    name: "Unstoppable Rage",
    category: "Isolated",
    description: "Anger overrides pain and reason. Single-minded furious focus."
  },
  {
    name: "Laughing Mad",
    category: "Isolated",
    description: "Inappropriate laughter during stress. Hysterical response to horror."
  },
  {
    name: "Thousand-Yard Stare",
    category: "Isolated",
    description: "Distant, haunted expression from trauma. Visible psychological damage."
  },
  {
    name: "Determined Defeatist",
    category: "Isolated",
    description: "Expects failure but persists anyway. Pessimistic but stubborn."
  },
  {
    name: "The Stoic",
    category: "Isolated",
    description: "Shows little emotional response. Maintains composure always."
  },
  {
    name: "Nightmare Fetishist",
    category: "Isolated",
    description: "Finds disturbing things fascinating. Comfort with horror."
  },

  // ISOLATED - Personal Growth
  {
    name: "Character Development",
    category: "Isolated",
    description: "Meaningful growth and change over time. Evolution of personality."
  },
  {
    name: "Good Feels Good",
    category: "Isolated",
    description: "Enjoys being heroic and helping. Altruism is rewarding."
  },
  {
    name: "Compressed Vice",
    category: "Isolated",
    description: "Single flaw exaggerated prominently. One weakness defines them."
  },
  {
    name: "Seen It All",
    category: "Isolated",
    description: "Nothing surprises them anymore. Experience breeds jaded calm."
  },

  // ISOLATED - Personal Challenges
  {
    name: "Chronic Hero Syndrome",
    category: "Isolated",
    description: "Compulsively must help everyone. Cannot ignore problems."
  },
  {
    name: "Doom Magnet",
    category: "Isolated",
    description: "Attracts disasters and danger. Trouble finds them inevitably."
  },
  {
    name: "No Sense of Direction",
    category: "Isolated",
    description: "Gets lost constantly. Navigation impossible."
  },
  {
    name: "The Jinx",
    category: "Isolated",
    description: "Brings bad luck to situations. Presence causes problems."
  },
  {
    name: "Attention Deficit... Ooh, Shiny!",
    category: "Isolated",
    description: "Easily distracted by anything interesting. Focus impossible."
  },
  {
    name: "Afraid of Their Own Strength",
    category: "Isolated",
    description: "Fears accidentally hurting others. Power controlled by fear."
  },
  {
    name: "Nervous Wreck",
    category: "Isolated",
    description: "Default state is anxiety. Constantly worried and stressed."
  },
  {
    name: "The Ophelia",
    category: "Isolated",
    description: "Fragile, delicate madness. Beautiful but broken."
  },
  {
    name: "Mask of Sanity",
    category: "Isolated",
    description: "Conceals madness very effectively. Insanity hidden behind normalcy."
  },

  // ISOLATED - Personal Quirks
  {
    name: "The Insomniac",
    category: "Isolated",
    description: "Difficulty sleeping. Functions on minimal rest."
  },
  {
    name: "Obsessive Compulsive",
    category: "Isolated",
    description: "Overwhelming need for patterns and behaviors. Compulsions control actions."
  },
  {
    name: "Super OCD",
    category: "Isolated",
    description: "Compulsions at superhuman extreme. Reality-bending perfectionism."
  },
  {
    name: "Collector of the Strange",
    category: "Isolated",
    description: "Gathers unusual or macabre items. Strange collection defines them."
  },
  {
    name: "Weirdness Censor",
    category: "Isolated",
    description: "Can't process strange events. Mind rationalizes impossible."
  },
  {
    name: "Wrong Context Magic",
    category: "Isolated",
    description: "Abilities that shouldn't exist here. Out-of-place powers."
  },

  // ISOLATED - Sensory & Perception
  {
    name: "Blind Seer",
    category: "Isolated",
    description: "Can see despite blindness. Sight through other means."
  },
  {
    name: "Prophecy Armor",
    category: "Isolated",
    description: "Ability to predict future events. Precognitive knowledge."
  },
  {
    name: "Flashback",
    category: "Isolated",
    description: "Past events shown suddenly. Memory becomes vivid."
  },
  {
    name: "Flash Forward",
    category: "Isolated",
    description: "Future events glimpsed briefly. Temporary precognition."
  },

  // ISOLATED - Time Alone
  {
    name: "Ground Hog Day Loop",
    category: "Isolated",
    description: "Repeating time period endlessly. Same events over again."
  },
  {
    name: "Slow Motion",
    category: "Isolated",
    description: "Events slow down perceptually. Time dilates."
  },
  {
    name: "Freeze-Frame Bonus",
    category: "Isolated",
    description: "Important details missed in real-time. Significance requires review."
  },

  // ISOLATED - Physical Conditions
  {
    name: "Super-Strength",
    category: "Isolated",
    description: "Enhanced physical power beyond normal limits. Exceptional strength."
  },
  {
    name: "Super-Reflexes",
    category: "Isolated",
    description: "Reaction time far exceeding baseline. Incredible responsiveness."
  },
  {
    name: "Lightning Reflexes",
    category: "Isolated",
    description: "Nearly precognitive responsiveness. Reacts before stimulus completes."
  },

  // COMPANION - Basics
  {
    name: "Loyal Animal Companion",
    category: "Companion",
    description: "Devoted animal friend. Faithful beast ally."
  },
  {
    name: "Amplified Animal Aptitude",
    category: "Companion",
    description: "Animal gains enhanced abilities. Superior to normal specimens."
  },
  {
    name: "Ridiculously Cute Creature",
    category: "Companion",
    description: "Adorably endearing being. Cuteness weaponized."
  },
  {
    name: "All Animals Are Dogs",
    category: "Companion",
    description: "All animals act like friendly dogs. Universal canine behavior."
  },
  {
    name: "Talking Animal",
    category: "Companion",
    description: "Animal that can speak human language. Verbal communication."
  },
  {
    name: "Robot Buddy",
    category: "Companion",
    description: "Mechanical companion. Robotic friend."
  },
  {
    name: "Sidekick",
    category: "Companion",
    description: "Junior partner or assistant. Helper character."
  },
  {
    name: "Animal Motif",
    category: "Companion",
    description: "Associated with specific animal symbolism. Thematic connection."
  },
  {
    name: "Big Friendly Dog",
    category: "Companion",
    description: "Large gentle canine companion. Protective but kind."
  },
  {
    name: "Killer Rabbit",
    category: "Companion",
    description: "Small cute creature that's dangerous. Appearance understates threat."
  },
  {
    name: "Cats Are Mean",
    category: "Companion",
    description: "Feline companion with attitude. Affection on their terms."
  },
  {
    name: "Precious Puppy",
    category: "Companion",
    description: "Young dog inspiring protective instincts. Emotional manipulation via cuteness."
  },
  {
    name: "Clever Crows",
    category: "Companion",
    description: "Corvid with problem-solving intelligence. Smart bird companion."
  },
  {
    name: "Uncanny Animal Instincts",
    category: "Companion",
    description: "Companion senses what humans miss. Reliable intuitive warnings."
  },
  {
    name: "Right-Hand Cat",
    category: "Companion",
    description: "Companion emphasizing owner's status. Authority figure's pet."
  },
  {
    name: "Heroic Dog",
    category: "Companion",
    description: "Companion performing brave protective acts. Canine heroism."
  },
  {
    name: "Team Pet",
    category: "Companion",
    description: "Companion adopted by entire group. Shared emotional support."
  },
  {
    name: "Big Badass Bird of Prey",
    category: "Companion",
    description: "Raptor companion with presence. Impressive hunting bird."
  },

  // COMPANION - Appearance
  {
    name: "Big Creepy-Crawlies",
    category: "Companion",
    description: "Giant insect or arachnid. Enlarged arthropod."
  },
  {
    name: "Canis Major",
    category: "Companion",
    description: "Huge dog or wolf. Massive canine."
  },
  {
    name: "Giant Flyer",
    category: "Companion",
    description: "Enormous flying creature. Large aerial beast."
  },
  {
    name: "Cute Monster Girl",
    category: "Companion",
    description: "Adorable but monstrous being. Sweet appearance, strange nature."
  },

  // COMPANION - Abilities
  {
    name: "Animal Eye Spy",
    category: "Companion",
    description: "See through animal's eyes. Remote viewing via creature."
  },
  {
    name: "Beast Master",
    category: "Companion",
    description: "Control and communicate with animals. Animal command ability."
  },

  // FANSERVICE - Appearance & Presentation
  {
    name: "Impossibly Cool Outfit",
    category: "Fanservice",
    description: "Clothing stylish beyond reason. Defies practicality, looks amazing."
  },
  {
    name: "Wardrobe Malfunction",
    category: "Fanservice",
    description: "Clothing tears or fails at inopportune moments. Unintended exposure."
  },
  {
    name: "Clothing Damage",
    category: "Fanservice",
    description: "Outfit becomes progressively damaged aesthetically. Battle wear looks good."
  },
  {
    name: "Form-Fitting Wardrobe",
    category: "Fanservice",
    description: "Clothes become extremely tight. Shows off physique."
  },
  {
    name: "Vapor Wear",
    category: "Fanservice",
    description: "Clothing thin or translucent. Technically dressed, barely concealing."
  },
  {
    name: "Skin-Tight Suit",
    category: "Fanservice",
    description: "Outfit conforms to body contours. Second-skin clothing."
  },
  {
    name: "Bare Your Midriff",
    category: "Fanservice",
    description: "Clothing exposes stomach and waist. Midriff revealed."
  },

  // FANSERVICE - Physical Features
  {
    name: "Supermodel Figure",
    category: "Fanservice",
    description: "Idealized striking body proportions. Magazine-worthy physique."
  },
  {
    name: "Impossibly Perfect Hair",
    category: "Fanservice",
    description: "Perpetually styled lustrous hair. Always salon-perfect."
  },
  {
    name: "Luminescent Blush",
    category: "Fanservice",
    description: "Glowing attractive flush when embarrassed. Visible endearing response."
  },
  {
    name: "Shower Scene Aesthetics",
    category: "Fanservice",
    description: "Water creates dramatic visual effects. Mundane washing becomes cinematic."
  },

  // FANSERVICE - Movement & Behavior
  {
    name: "Slow Motion Drop",
    category: "Fanservice",
    description: "Falls in dramatic slow-motion. Physics becomes aesthetic."
  },
  {
    name: "Accidental Pervert Setup",
    category: "Fanservice",
    description: "Situations create compromising scenarios. Universe arranges misunderstandings."
  },
  {
    name: "Wind Gust Timing",
    category: "Fanservice",
    description: "Perfectly-timed breeze at dramatic moments. Wind on cue."
  },

  // FANSERVICE - Situations
  {
    name: "Wet Clothes Cling",
    category: "Fanservice",
    description: "Soaked fabric adheres revealing contours. Water makes everything form-fitting."
  },
  {
    name: "Convenient Steam",
    category: "Fanservice",
    description: "Vapor obscures just enough while highlighting. Strategic censorship."
  },
  {
    name: "Beach Episode Aesthetics",
    category: "Fanservice",
    description: "Beach setting gains enhanced appeal. Water, sun, swimwear optimized."
  },
  {
    name: "Furo Scene Appeal",
    category: "Fanservice",
    description: "Bathing scenario with dramatic lighting. Atmospheric hygiene."
  },
  {
    name: "Wardrobe Upgrade",
    category: "Fanservice",
    description: "Clothing becomes more appealing. Outfit improves aesthetically."
  },

  // FANSERVICE - Physical Dynamics
  {
    name: "Action Dress Rip",
    category: "Fanservice",
    description: "Movement causes strategic tears. Always aesthetic, never hindering."
  },
  {
    name: "Impossibly Graceful",
    category: "Fanservice",
    description: "Every movement fluid and elegant. Stumbles look choreographed."
  },
  {
    name: "Hair Flip Drama",
    category: "Fanservice",
    description: "Hair movements gain emphasis. Head turns become dramatic."
  },
  {
    name: "Perfect Lighting",
    category: "Fanservice",
    description: "Illumination always flattering. Shadows fall attractively."
  },
  {
    name: "Artistic Sweat",
    category: "Fanservice",
    description: "Perspiration appears aesthetically. Glistening not gross."
  },

  // FANSERVICE - Proximity & Interaction
  {
    name: "Forced Into Close Quarters",
    category: "Fanservice",
    description: "Situations push into intimate proximity. Cramped becomes more cramped."
  },
  {
    name: "Convenient Stumble",
    category: "Fanservice",
    description: "Trips lead to compromising positions. Gravity as matchmaker."
  },
  {
    name: "Accidental Intimacy",
    category: "Fanservice",
    description: "Innocent actions create intimate moments. Suggestive misunderstandings."
  },
  {
    name: "Perfect Catch Position",
    category: "Fanservice",
    description: "Catching person lands in dramatic pose. Bridal carry guaranteed."
  },

  // FANSERVICE - Environmental Effects
  {
    name: "Romantic Lighting",
    category: "Fanservice",
    description: "Light shifts to golden hour aesthetics. Mood lighting appears."
  },
  {
    name: "Flower Petal Storm",
    category: "Fanservice",
    description: "Petals swirl at dramatic moments. Nature provides atmosphere."
  },
  {
    name: "Dramatic Fabric Flow",
    category: "Fanservice",
    description: "Clothes flow in selective wind. Breeze for maximum drama."
  },
  {
    name: "Sparkle Effect",
    category: "Fanservice",
    description: "Literal sparkles manifest around appeal. Visual emphasis."
  },
  {
    name: "Slow Motion Approach",
    category: "Fanservice",
    description: "Walking becomes cinematic. Movement gains gravitas."
  },

  // FANSERVICE - Costume Changes
  {
    name: "Instant Costume Change",
    category: "Fanservice",
    description: "Outfit transforms instantly. Wardrobe change without transition."
  },
  {
    name: "Battle Lingerie",
    category: "Fanservice",
    description: "Damage leaves attractive undergarments. Armor fails strategically."
  },
  {
    name: "Swimsuit Reveal",
    category: "Fanservice",
    description: "Scenarios provide swimwear showcase. Pool moments engineered."
  },
  {
    name: "Towel Scene Timing",
    category: "Fanservice",
    description: "Perfect timing for towel scenarios. Just enough coverage."
  },
  {
    name: "Zipper Malfunction",
    category: "Fanservice",
    description: "Fasteners fail at convenient times. Closures unreliable."
  },

  // FANSERVICE - Poses & Positioning
  {
    name: "Pin-Up Pose",
    category: "Fanservice",
    description: "Body arranges aesthetically automatically. Cover-model worthy stance."
  },
  {
    name: "Suggestive Eating",
    category: "Fanservice",
    description: "Consuming food becomes alluring. Meals gain sensual overtones."
  },
  {
    name: "Stretch and Arch",
    category: "Fanservice",
    description: "Stretching emphasizes physique. Limbering becomes display."
  },
  {
    name: "The Lean-In",
    category: "Fanservice",
    description: "Bending forward at opportune moments. Gravity conspires."
  },
  {
    name: "Leg Focus Frame",
    category: "Fanservice",
    description: "Movement emphasizes leg presentation. Invisible camera angles favor limbs."
  },
  {
    name: "Vulnerable Sleeping Position",
    category: "Fanservice",
    description: "Sleep poses arranged appealingly. Unconscious looks intentional."
  },

  // FANSERVICE - Reactions & Expressions
  {
    name: "Lip Bite Moment",
    category: "Fanservice",
    description: "Nervous habit manifests attractively. Unconscious appeal timing."
  },
  {
    name: "Heavy Breathing Emphasis",
    category: "Fanservice",
    description: "Exertion causes noticeable breathing. Heaving pronounced."
  },
  {
    name: "Flustered Fidgeting",
    category: "Fanservice",
    description: "Embarrassment creates endearing gestures. Awkwardness becomes charming."
  },
  {
    name: "Voice Drops Lower",
    category: "Fanservice",
    description: "Vocal tone becomes huskier. Voice gains bedroom quality."
  },

  // FANSERVICE - Intimate Scenarios
  {
    name: "Sharing Body Heat",
    category: "Fanservice",
    description: "Cold requires close physical contact. Temperature demands proximity."
  },
  {
    name: "Tend to Wounds Closely",
    category: "Fanservice",
    description: "Injuries require intimate positioning. First aid becomes contact sport."
  },
  {
    name: "Training Gets Handsy",
    category: "Fanservice",
    description: "Instruction requires extensive touching. Learning through contact."
  },
  {
    name: "Massage Scenario",
    category: "Fanservice",
    description: "Situations require therapeutic touch. Tension relief opportunity."
  },
  {
    name: "Clothes Sharing",
    category: "Fanservice",
    description: "Must borrow revealing garments. Emergency wardrobe from wrong person."
  },

  // FANSERVICE - Accidental Exposure
  {
    name: "Strap Slip",
    category: "Fanservice",
    description: "Straps slide out of position. Clothing fails to stay secured."
  },
  {
    name: "Wind Billows Skirt",
    category: "Fanservice",
    description: "Breeze catches fabric perfectly. Updraft timing optimal."
  },
  {
    name: "See-Through When Backlit",
    category: "Fanservice",
    description: "Backlighting renders clothing translucent. Silhouette reveals."
  },

  // FANSERVICE - Aesthetic Amplification
  {
    name: "Dewy Glow",
    category: "Fanservice",
    description: "Skin gains luminous radiance. Magazine-ad complexion."
  },
  {
    name: "Kissable Lips",
    category: "Fanservice",
    description: "Mouth appears perpetually moisturized. Lips gain emphasis."
  },
  {
    name: "Bedroom Hair",
    category: "Fanservice",
    description: "Messy hair appears artfully styled. Tousled becomes attractive."
  },
  {
    name: "Post-Activity Flush",
    category: "Fanservice",
    description: "Exertion creates attractive color. Exercise looks flattering."
  },

  // WILDCARD - Meta & Fourth Wall
  {
    name: "Rule of Cool",
    category: "Wildcard",
    description: "Logic suspended because result is awesome. Implausibility forgiven for spectacle."
  },
  {
    name: "Brain Bleach",
    category: "Wildcard",
    description: "Witnessing something desperately want to forget. Extreme disgust."
  },
  {
    name: "Breaking the Fourth Wall",
    category: "Wildcard",
    description: "Acknowledge audience directly. Speak to viewers."
  },
  {
    name: "Leaning on the Fourth Wall",
    category: "Wildcard",
    description: "Almost break fourth wall. Hint at narrative awareness."
  },
  {
    name: "Medium Awareness",
    category: "Wildcard",
    description: "Knows they're in story. Aware of fictional nature."
  },
  {
    name: "No Fourth Wall",
    category: "Wildcard",
    description: "Constantly addresses audience. Viewers always acknowledged."
  },
  {
    name: "Reaching Through the Fourth Wall",
    category: "Wildcard",
    description: "Interact with audience. Cross narrative boundary."
  },
  {
    name: "Painting the Medium",
    category: "Wildcard",
    description: "Story affects its format. Narrative changes presentation."
  },

  // WILDCARD - Narrative Structure
  {
    name: "Chekhov's Gun",
    category: "Wildcard",
    description: "Insignificant item becomes crucial later. Everything serves purpose."
  },
  {
    name: "Foreshadowing",
    category: "Wildcard",
    description: "Subtle hints point toward future. Creates sense of inevitability."
  },
  {
    name: "The Reveal",
    category: "Wildcard",
    description: "Hidden secret finally exposed. Understanding fundamentally changes."
  },
  {
    name: "Wham Episode",
    category: "Wildcard",
    description: "Development radically alters status quo. Nothing same afterward."
  },
  {
    name: "Wham Line",
    category: "Wildcard",
    description: "Single line completely redirects plot. Never saw it coming."
  },
  {
    name: "Prolonged Prologue",
    category: "Wildcard",
    description: "Extended opening before main plot. Establishes world extensively."
  },

  // WILDCARD - Environmental
  {
    name: "Alien Geometries",
    category: "Wildcard",
    description: "Impossible spatial arrangements. Angles hurt to comprehend."
  },
  {
    name: "Amusement Park of Doom",
    category: "Wildcard",
    description: "Park becomes trap or danger. Attractions turn deadly."
  },
  {
    name: "Crapsaccharine World",
    category: "Wildcard",
    description: "Beautiful surface hiding darkness. Cheerful facade masks horror."
  },
  {
    name: "Eldritch Location",
    category: "Wildcard",
    description: "Place defying normal reality. Operates by impossible rules."
  },
  {
    name: "Shifting Sand Land",
    category: "Wildcard",
    description: "Treacherous desert terrain. Landscape constantly changes."
  },
  {
    name: "Under the Sea",
    category: "Wildcard",
    description: "Underwater environment challenges. Depth affects everything."
  },

  // WILDCARD - Objects
  {
    name: "Artifact of Doom",
    category: "Wildcard",
    description: "Cursed dangerous object. Power comes with price."
  },
  {
    name: "Power Crystal",
    category: "Wildcard",
    description: "Gemstone containing energy. Magical ability source."
  },
  {
    name: "Mundane Utility",
    category: "Wildcard",
    description: "Extraordinary abilities for trivial tasks. Superpowers for chores."
  },
  {
    name: "Temporary Online Content",
    category: "Wildcard",
    description: "Digital item with limited availability. Expires soon."
  },
  {
    name: "Clothes Make the Superman",
    category: "Wildcard",
    description: "Garment grants powers. Outfit is ability source."
  },
  {
    name: "Cool Bike",
    category: "Wildcard",
    description: "Impressive motorcycle with features. Beyond-normal vehicle."
  },
  {
    name: "Impossibly Cool Clothes",
    category: "Wildcard",
    description: "Impractically stylish yet functional. Fashion defies physics."
  },

  // WILDCARD - Identity & Mirrors
  {
    name: "Mirror Self",
    category: "Wildcard",
    description: "Opposite version in personality. Same appearance, inverted nature."
  },

  // WILDCARD - Probability & Chaos
  {
    name: "Luck Stat",
    category: "Wildcard",
    description: "Quantifiable measure of fortune. Numerical probability favor."
  },
  {
    name: "Lucky Seven",
    category: "Wildcard",
    description: "Number seven brings fortune. Specific numeral carries power."
  },
  {
    name: "Crazy Enough to Work",
    category: "Wildcard",
    description: "Ridiculous strategy succeeds. Absurdity prevents countering."
  },

  // WILDCARD - Weird & Unpredictable
  {
    name: "Invisible to Normals",
    category: "Wildcard",
    description: "Only visible to special people. Selective visibility."
  },
  {
    name: "Poke the Poodle",
    category: "Wildcard",
    description: "Attempting villainy achieves harmlessness. Failed wickedness."
  },
  {
    name: "Emerging from the Shadows",
    category: "Wildcard",
    description: "Theatrical appearance from darkness. Dramatic reveal."
  },
  {
    name: "Video Game Cruelty Punishment",
    category: "Wildcard",
    description: "Negative repercussions for meanness. System penalizes cruelty."
  },
  {
    name: "Disneyesque",
    category: "Wildcard",
    description: "Classic Disney animation style. Bright fairy tale aesthetics."
  },
  {
    name: "Dark Is Not Evil",
    category: "Wildcard",
    description: "Ominous appearance hiding goodness. Scary exterior, kind heart."
  },
  {
    name: "Light Is Not Good",
    category: "Wildcard",
    description: "Bright appearance masking evil. Beautiful surface, cruel inside."
  },
  {
    name: "Personality Powers",
    category: "Wildcard",
    description: "Abilities match character traits. Power expresses nature."
  },
  {
    name: "Status Effect-Powered Ability",
    category: "Wildcard",
    description: "Requires specific conditions to function. Circumstance-dependent power."
  },

  // WILDCARD - Meta/Reality
  {
    name: "Strange Minds Think Alike",
    category: "Wildcard",
    description: "Multiple people reach same conclusion. Suggests pattern."
  },
  {
    name: "Tempting Fate",
    category: "Wildcard",
    description: "Statements provoke universe. What could go wrong guarantees problems."
  },
  {
    name: "Hoist by Their Own Petard",
    category: "Wildcard",
    description: "Plans backfire on originator. Defeated by own strategy."
  },
  {
    name: "Contrived Coincidence",
    category: "Wildcard",
    description: "Unlikely event at convenient moment. Too perfect to be natural."
  },

  // WILDCARD - Effects
  {
    name: "The Worf Effect",
    category: "Wildcard",
    description: "Strong character defeated to show threat. Demonstrates danger."
  },
  {
    name: "Harmless Freezing",
    category: "Wildcard",
    description: "Cold immobilizes without injury. Recovery intact when thawed."
  },
  {
    name: "Ballroom Blitz",
    category: "Wildcard",
    description: "Formal event erupts into chaos. Elegant setting becomes battlefield."
  },
  {
    name: "Convection Schmonvection",
    category: "Wildcard",
    description: "Heat sources less dangerous than realistic. Approach fire safely."
  },
];

// Derived structures for backward compatibility
export const TROPES: { [category: string]: string[] } = ALL_TROPES.reduce((acc, trope) => {
  if (!acc[trope.category]) {
    acc[trope.category] = [];
  }
  acc[trope.category].push(trope.name);
  return acc;
}, {} as { [category: string]: string[] });

export const TROPE_DESCRIPTIONS: { [name: string]: string } = ALL_TROPES.reduce((acc, trope) => {
  acc[trope.name] = trope.description;
  return acc;
}, {} as { [name: string]: string });

export const CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
  "Extreme Combat": "High-stakes fights: Endbringers, S-class threats, life-or-death battles",
  "Combat": "Regular cape fights, street-level action, tactical encounters",
  "Social": "Interpersonal interactions, reputation, relationships, group dynamics",
  "Isolated": "Personal traits, solo transformation, individual challenges",
  "Companion": "Tropes affecting companions or animal allies",
  "Fanservice": "Aesthetic appeal, dramatic presentation, visual enhancement",
  "Wildcard": "Context-dependent tropes with unpredictable effects"
};
