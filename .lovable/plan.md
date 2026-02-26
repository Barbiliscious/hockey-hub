

## Plan: Replace Landing Page Hero Background with Inline SVG Hockey Pitch

### What Changes

The landing page hero section (lines 17-28 of `Landing.tsx`) currently uses a photo (`hero-bg.jpg`) with a gradient overlay. We will replace this with the hockey pitch SVG rendered inline as the background, creating a clean vector sports aesthetic.

### File: `src/pages/Landing.tsx`

**Lines 11, 18-28** -- Replace the background image div with an inline SVG hockey pitch.

1. Remove the `import heroBg` line (line 11) since the photo is no longer used.

2. Replace the background div (lines 18-28) with an inline SVG that renders the full hockey pitch diagram directly. The SVG will:
   - Fill the entire hero section using `absolute inset-0 w-full h-full`
   - Use `preserveAspectRatio="xMidYMid slice"` so it covers the section fully (like `background-size: cover`) without distortion
   - Use the same viewBox (`0 0 1000 620`) and identical markup as `HockeyPitch.tsx` -- royal blue surround, green field, white boundary, 23m lines, center line, D arcs, dotted arcs, penalty spots, goals with grey posts, and tick marks
   - A semi-transparent dark overlay div on top of the SVG to ensure text remains readable (e.g. `bg-primary/70`)

3. The SVG is rendered directly in `Landing.tsx` rather than importing `HockeyPitch` because:
   - `HockeyPitch` expects `children` (player overlay) which is not needed here
   - The `preserveAspectRatio` value differs (`slice` for cover behaviour vs `meet` for the lineup builder)
   - Keeps the landing page self-contained

### File: `src/components/lineup/HockeyPitch.tsx` -- No Changes

The existing lineup pitch component remains untouched. The landing page gets its own standalone SVG.

### Technical Details

- The SVG constants (PADDING, FIELD dimensions, arc radii, etc.) are duplicated as local consts in Landing.tsx. This is acceptable since these are static layout values and the two use cases need different `preserveAspectRatio` behaviour.
- The tick marks are generated with the same loop logic.
- The overlay gradient changes from `bg-gradient-to-br from-primary/95 via-primary/85 to-accent/60` to a simpler `bg-primary/60` or similar semi-transparent overlay so the pitch shows through clearly while text stays legible.
- No new dependencies or files needed.

