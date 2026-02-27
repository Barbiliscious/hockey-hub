

## Plan: Add Field Images to Project

The uploaded field images are now available. Here's what will be done:

### Step 1: Copy images to project
- Copy `Field_1-2.png` → `src/assets/Field_1.png` (blue pitch — hero background)
- Copy `Field_2-2.png` → `src/assets/Field_2.png` (green pitch — lineup builder)

### Step 2: Update Landing page hero
- Import `Field_1.png` in `src/pages/Landing.tsx`
- Use it as the hero section background image with `object-cover` styling, replacing the current gradient-only background

### Step 3: Update auth page branding panels
- Import `Field_1.png` in `Login.tsx`, `Signup.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`
- Use it as the background for the right/left branding panel on each page

### Step 4: Update lineup builder pitch
- Import `Field_2.png` in `src/components/lineup/HockeyPitch.tsx`
- Use it as the pitch background, replacing the current SVG/CSS pitch graphic

### Files Changed

| File | Change |
|---|---|
| `src/assets/Field_1.png` | New — blue field image |
| `src/assets/Field_2.png` | New — green field image |
| `src/pages/Landing.tsx` | Hero background → Field_1.png |
| `src/pages/Login.tsx` | Branding panel background → Field_1.png |
| `src/pages/Signup.tsx` | Branding panel background → Field_1.png |
| `src/pages/ForgotPassword.tsx` | Branding panel background → Field_1.png |
| `src/pages/ResetPassword.tsx` | Branding panel background → Field_1.png |
| `src/components/lineup/HockeyPitch.tsx` | Pitch graphic → Field_2.png |

