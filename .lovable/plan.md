

## Implementation Plan: Redesign Hockey Pitch to Match Reference Image

### Overview

Replace the current portrait-oriented CSS pitch with a landscape SVG-based field hockey diagram matching the reference image: royal blue surround, flat green field, proper D arcs, 23m lines, center line, goals with grey posts, penalty spots, dotted arcs, and tick marks.

### Files to Change

#### 1. `src/components/lineup/HockeyPitch.tsx` -- Full Rewrite

Replace the entire CSS-based pitch (lines 1-54) with an inline SVG inside a wrapper div.

**SVG structure** (viewBox `0 0 1000 620`):
- Royal blue background rect filling the entire viewBox
- Green playing surface rect centered within it (approx 60px padding)
- White boundary line inset slightly from the green edge
- Three vertical white lines: left 23m, center, right 23m (evenly spaced)
- Left and right shooting circles: bold white semicircular arcs bulging inward from each end line
- Penalty spot dots inside each D (small filled white circles)
- Dotted semicircular arcs outside each D (wider radius, made of small evenly-spaced dots using `stroke-dasharray`)
- Goals at each end: small rectangles protruding outward into the blue surround, with light grey side posts
- Small white tick marks along all four sidelines at regular intervals
- No gradients, no shadows, no text

The `children` overlay div remains absolutely positioned on top of the SVG so drag-and-drop continues to work unchanged.

Aspect ratio changes from `aspect-[3/4]` (portrait) to `aspect-[1000/620]` (landscape). Remove `max-w-md` constraint to let the pitch use full width.

#### 2. `src/components/lineup/types.ts` -- Rotate Position Coordinates

All coordinates rotate 90 degrees. Attack moves to the **right** side, goalkeeper to the **left**. "Left" positions map to the top of the landscape view, "right" to the bottom.

Updated `PITCH_POSITIONS` array (lines 26-44):

| Position | Old x, y | New x, y |
|---|---|---|
| LW | 20, 15 | 85, 20 |
| CF | 50, 12 | 88, 50 |
| RW | 80, 15 | 85, 80 |
| LI | 25, 35 | 65, 25 |
| CH | 50, 32 | 68, 50 |
| RI | 75, 35 | 65, 75 |
| LH | 25, 58 | 42, 25 |
| FB | 50, 62 | 38, 50 |
| RH | 75, 58 | 42, 75 |
| GK | 50, 85 | 15, 50 |

Comments updated to reflect landscape orientation (attack = right, defense = left).

#### 3. `src/components/lineup/PitchPosition.tsx` -- Minor Colour Fix

Line 60: Change `ring-offset-green-800` to `ring-offset-[#2d8a4e]` (or whatever the exact green hex used in the SVG field fill) so the selection ring blends with the new pitch colour.

### Files NOT Changed

- `LineupView.tsx` -- no changes needed; it passes children into `HockeyPitch` and uses percentage positioning
- `Lineup.tsx` -- no changes needed
- `BenchArea.tsx`, `PlayerChip.tsx`, `PlayerSelectDialog.tsx` -- unchanged
- No new dependencies required

### Technical Notes

- SVG scales responsively via `w-full` with the SVG `viewBox` maintaining aspect ratio
- The children overlay div uses `absolute inset-0` so percentage-based player positioning maps correctly over the SVG
- Drag-and-drop behaviour is unaffected since `PitchPosition` still uses `left`/`top` percentages
- The D arcs will use SVG `<path>` elements with arc commands for precise semicircles
- Dotted arcs use `stroke-dasharray` on a `<circle>` or `<path>` element
- Tick marks are small `<line>` elements at regular intervals along the boundary

