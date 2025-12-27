# Plot Twist Trope Roller

A web-based simulator for Danny Hebert's Trump power from the Worm fanfiction "Plot Twist."

## About the Story

**Plot Twist** is a Worm AU fanfiction where Danny Hebert triggers with powers instead of Taylor. After sitting helplessly at his daughter's hospital bedside following the locker incident, Danny's overwhelming need to protect and help manifests as a reality-warping Trump power that applies random narrative tropes to his environment.

The story explores a father pulled deeper into cape life as he tries to be better for Taylor—never knowing she's also triggered and become a cape herself. Both keep their powers secret from each other, creating dramatic irony as Danny's helpful interventions generate the conflict that makes his power stronger.

## The Power: Trope Application

Danny's power pulls random narrative tropes from the "story" of the world and applies them to targets within range. Each trope is governed by two characteristics rolled on 2d20:

- **Intensity** (2-19): How strong the effect is, from "extremely subtle" to "overwhelming, reality-warping"
- **Longevity** (2-19): How long it lasts, from "12 seconds" to "permanent (never expires)"

Danny has seconds to assign each die result to either characteristic and choose a target, or the trope defaults to affecting him.

### Special Mechanics

- **Natural 1**: Blind reroll—Danny doesn't know what changed
- **Natural 20**: Earns a Bonus Modifier to enhance existing tropes (rerolls to 19 for the current pull)
- **Charge System**: 5 charges maximum; 1 charge per day, 1 per battle
- **Banking**: Store up to 5 tropes for later use (3-day limit, locks charges)
- **Energy Refunds**: Weaker powers return more energy when they expire

## What This Tool Does

This web app simulates Danny's power for story planning and gameplay, featuring:

- 300+ tropes across 6 categories (Extreme Combat, Combat, Social, Isolated, Companion, Wildcard)
- 2d20 rolling with assignment workflow (FAIL/BANK/APPLY)
- Charge management system with decimal precision
- Bonus modifier system (9 different enhancement types)
- Timeline tracking (starting January 7, 2011 - Danny's trigger date)
- Banking system with auto-dissipation
- Save/load functionality with export/import

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- LocalStorage for save states

## Getting Started

```bash
npm install
npm run dev
```

## License

MIT License - Feel free to use this for your own Worm fanfiction or tabletop campaigns!

## Story Status

*Plot Twist* is currently in development. This tool was created to help track Danny's power usage during story writing and may be released alongside the fanfiction for reader interaction.

---

*Worm is a web serial by Wildbow. This is a fan-created tool for a fanfiction work.*
