

## Plan: Seed Data + Add Field Images

### Step 1: Delete placeholder data and seed correct data

Use the data insert tool to run these SQL statements in order:

1. **Delete existing data** (dependency order):
   - `DELETE FROM lineups;`
   - `DELETE FROM games;`
   - `DELETE FROM teams;`
   - `DELETE FROM clubs;`
   - `DELETE FROM associations;`

2. **Insert associations**: Hockey Ballarat, Wimmera

3. **Insert 13 clubs** with home grounds:
   - Hockey Ballarat: Blaze HC, Bobcats HC, Ducks HC, Eureka and Golden City HC, Grampians HC, Lucas HC
   - Wimmera: Dimboola HC, Horsham HC, Kaniva HC, Nhill & District SC, Warracknabeal HC, Yanac HC

4. **Insert all teams** with correct age_group/gender/division mappings per the approved plan

### Step 2: Store field images and update Landing page

- Copy `Field_1.png` and `Field_2.png` to `src/assets/`
- Delete `src/assets/hero-bg.jpg`
- Update `src/pages/Landing.tsx`:
  - Remove all SVG constants and inline `<svg>` block (~70 lines of code)
  - Import `Field_1.png` as the hero background image
  - Use a simple `<img>` tag with `object-cover` instead of the SVG
  - Keep the overlay and all other content unchanged

### Files Changed

| File | Change |
|---|---|
| Database | Delete old data, insert 2 associations, 13 clubs, ~50 teams |
| `src/assets/Field_1.png` | New -- blue field image |
| `src/assets/Field_2.png` | New -- green field image |
| `src/pages/Landing.tsx` | Replace SVG with `Field_1.png` background image |
| `src/assets/hero-bg.jpg` | Delete |

