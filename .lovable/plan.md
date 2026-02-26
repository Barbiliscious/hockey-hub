

## Proposed Code Changes: Blue Synthetic Turf Hockey Pitch

Here is the exact code that would replace the current `Landing.tsx`. Only the SVG constants and colour values change -- the rest of the file stays identical.

### Changes summary (lines 24-25, 62-63, 70-71, 74, 77, 83):

**Constants (lines 24-25)** -- larger D-arcs to match reference images:
```typescript
// CURRENT:
const D_RADIUS = 100;
const DOT_ARC_RADIUS = 130;

// NEW:
const D_RADIUS = 160;
const DOT_ARC_RADIUS = 200;
```

**SVG fills (lines 62-63)** -- blue turf instead of green:
```tsx
// CURRENT:
<rect x="0" y="0" width="1000" height="620" fill="#1a3a6b" />
<rect x={FIELD_X} y={FIELD_Y} width={FIELD_W} height={FIELD_H} fill="#2d8a4e" />

// NEW:
<rect x="0" y="0" width="1000" height="620" fill="#0033aa" />
<rect x={FIELD_X} y={FIELD_Y} width={FIELD_W} height={FIELD_H} fill="#0066cc" />
```

**Dashed arcs (lines 70-71)** -- longer dashes matching reference:
```tsx
// CURRENT:
strokeDasharray="4 8"

// NEW:
strokeDasharray="12 10"
```

**Goal fills (lines 74, 77)** -- match new surround colour:
```tsx
// CURRENT:
fill="#1a3a6b"

// NEW:
fill="#0033aa"
```

**Overlay opacity (line 83)** -- more transparent so blue pitch shows through:
```tsx
// CURRENT:
<div className="absolute inset-0 z-[1] bg-primary/60" />

// NEW:
<div className="absolute inset-0 z-[1] bg-primary/40" />
```

### What stays the same

Everything else in the file is untouched: imports, tick mark generation, content section, features section, CTA section, footer, and the `FeatureCard` component. `HockeyPitch.tsx` (the lineup builder component) remains unchanged with its green field.

