# Plot Twist Trope Roller

A React + TypeScript web application for simulating Danny Hebert's Trump power from the Worm fanfiction "Plot Twist". Roll 2d20 to generate random tropes with variable Intensity and Longevity.

## 🎮 Features

- **2d20 Trope Rolling System** - 330+ tropes across 7 categories
- **Natural 20 & Natural 1 Handling** - Blind rerolls and bonus modifiers
- **Charge Management** - Max 5 charges, regenerates 1/day + 1/battle
- **Banking System** - Store up to 5 tropes for 3 days
- **Energy Refunds** - Smart refund calculation for expired/failed tropes
- **Timeline Tracking** - Starts from January 7, 2011 trigger date
- **Save/Load System** - Persist your game state to localStorage
- **Pull Workflow** - FAIL/BANK/APPLY decision system
- **Active/Expired Tabs** - Organize your tropes efficiently
- **Full Type Safety** - Built with TypeScript

## 🚀 Running Locally

### Development Mode
```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Then open your browser to `http://localhost:5173`

### Production Build
```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

## 🌐 GitHub Pages Deployment

The app is pre-built and ready to deploy using the traditional `docs/` folder method.

**Setup Steps:**

1. **Merge to main branch**:
   ```bash
   # From your feature branch
   git checkout main
   git merge claude/plot-twist-trope-roller-26LEJ
   git push origin main
   ```

2. **Enable GitHub Pages** in your repository:
   - Go to `Settings` → `Pages`
   - Under "Source", select **`Deploy from a branch`**
   - Select branch: **`main`**
   - Select folder: **`/docs`**
   - Click **`Save`**

3. **Access your deployed app**:
   - Your app will be available at: `https://samuelcryan.github.io/PlotTwistDiceRoller/`
   - It may take 1-2 minutes for the first deployment

### Updating the Deployed App

When you make changes:

```bash
# Build the updated version
npm run build

# Commit and push the updated docs/ folder
git add docs/
git commit -m "Update app"
git push origin main
```

GitHub Pages will automatically serve the updated files within a few minutes.

## 📖 How to Use

1. **Pull a Trope**
   - Click "Pull New Trope" (costs 1 charge)
   - See the trope name, description, and 2d20 roll results

2. **Choose Your Assignment**
   - Decide which die goes to Intensity (power strength)
   - The other die goes to Longevity (duration)
   - See live preview of the effect

3. **Select Target**
   - Danny (default)
   - Ally / Enemy / Neutral / Object (with custom name)

4. **Take Action**
   - **FAIL**: Trope doesn't work, get full charge refund
   - **BANK**: Save for later (locks 1 charge for 3 days)
   - **APPLY**: Activate the trope immediately

5. **Manage Tropes**
   - View active/expired tropes in tabs
   - Toggle expiration status
   - Collect energy refunds from expired tropes
   - Unbank stored tropes

6. **Regenerate Charges**
   - **Advance Day**: +1 charge (simulates day passing)
   - **Battle**: +1 charge (simulates combat encounter)

## 🎲 Game Mechanics

### Charge System
- **Maximum**: 5 charges
- **Regeneration**: 1 per day + 1 per battle
- **Banking Cost**: Each banked trope locks 1 charge

### Natural Rolls
- **Natural 1**: Blind reroll on APPLY (treat rerolled 1 as 2)
- **Natural 20**: Earn bonus modifier, 20 rerolls to 19, trope pull continues

### Energy Refunds
- **Failed Pull**: Full 1.0 charge refund
- **Expired Trope**: Calculated refund = `1 - ((intensity + longevity) / 40)`
- **Bank Dissipation**: Same as expired (after 3 days)

### Intensity Scale (2-19)
- 2-5: Subtle effects
- 6-13: Noticeable changes
- 14-19: Dramatic, reality-warping power

### Longevity Scale (2-19)
- 2-9: Seconds to minutes
- 10-14: Hours to days
- 15-17: Days to month
- 18: Permanent (degrades over time)
- 19: Permanent (never expires)

## 🏗️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Save/load persistence

## 📁 Project Structure

```
src/
├── components/     # React components (integrated into App.tsx)
├── data/
│   ├── tropes.ts          # 330+ tropes across 7 categories
│   ├── descriptions.ts    # Detailed trope descriptions
│   └── scales.ts          # Intensity & Longevity scales
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   ├── helpers.ts         # Dice rolling, formatting
│   ├── refundCalculator.ts # Energy refund formulas
│   └── storage.ts         # LocalStorage operations
├── App.tsx        # Main application
└── main.tsx       # Entry point
```

## 🎨 Customization

### Modify Tropes
Edit `src/data/tropes.ts` to add/remove tropes from categories.

### Add Descriptions
Update `src/data/descriptions.ts` with trope descriptions.

### Adjust Mechanics
Modify scales in `src/data/scales.ts` or formulas in `src/utils/refundCalculator.ts`.

### Change Styling
Update Tailwind classes in `src/App.tsx` or modify `tailwind.config.js`.

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### GitHub Pages 404
- Ensure the `base` path in `vite.config.ts` matches your repo name
- Check that GitHub Pages is enabled in repository settings
- Verify the Actions workflow completed successfully

## 📝 License

This project is open source and available for personal use.

## 🔗 Links

- **Story Document**: See `/reference/PlotTwistStoryDocument` for power mechanics
- **Trope List**: See `/reference/TropeList.md` for complete trope reference
- **Repository**: [PlotTwistDiceRoller](https://github.com/samuelcryan/PlotTwistDiceRoller)
