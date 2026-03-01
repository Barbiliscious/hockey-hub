
## Plan: App Mode System (Admin Mode vs Player Mode)

### Status: Planning — awaiting approval to implement

### Previous Plans
- ✅ Team Display Update (complete)

---

### Concept

The app operates in two distinct **modes** based on the user's roles:

1. **Admin Mode** — For users with admin roles (SUPER_ADMIN, ASSOCIATION_ADMIN, CLUB_ADMIN). Shows admin-specific navigation, dashboard, and features. Profile icon leads to **Association Settings page** (full branding/config page for the association).

2. **Player Mode** — For users with player/coach roles. Shows player-specific navigation (Dashboard, Fixtures, Stats, Chat). Profile icon leads to **personal profile page** (existing Profile.tsx).

Users with **both** admin and player roles see a **"Switch Mode"** button in the **sidebar footer** to toggle between modes.

---

### Architecture

#### New Context: `AppModeContext`

| Field | Type | Description |
|---|---|---|
| `mode` | `"admin" \| "player"` | Current active mode |
| `setMode` | function | Switch mode |
| `canSwitchMode` | boolean | True if user has both admin and player/coach roles |
| `availableModes` | string[] | Which modes the user can access |

- On login, mode defaults to `"admin"` if user has any admin role, otherwise `"player"`
- Persisted to `localStorage` so it survives page refreshes

#### Navigation Changes

**Admin Mode nav** (completely different sidebar):
- Dashboard (admin dashboard with stats tiles)
- Associations (SUPER_ADMIN only)
- Clubs
- Teams
- Users

**Player Mode nav** (existing player sidebar):
- Dashboard
- Fixtures
- Statistics
- Chat

#### Profile Icon Behavior

| Mode | Profile icon destination |
|---|---|
| Admin | `/admin/association-profile` — new page showing association name, logo, stats, settings |
| Player | `/profile` — existing personal profile page |

#### Login Redirect

- After login, query `user_roles`
- If admin role found → set mode to `"admin"`, navigate to `/admin`
- Otherwise → set mode to `"player"`, navigate to `/dashboard`

#### Sidebar Footer Mode Switcher

- Only visible if `canSwitchMode` is true
- Shows current mode label + toggle button
- Example: "Admin Mode" with a "Switch to Player" button (or vice versa)

---

### Files to Create

| File | Purpose |
|---|---|
| `src/contexts/AppModeContext.tsx` | Mode state context with localStorage persistence |
| `src/pages/admin/AssociationProfile.tsx` | Association detail/settings page (logo, name, stats, config) |

### Files to Modify

| File | Change |
|---|---|
| `src/App.tsx` | Wrap with `AppModeProvider`, add `/admin/association-profile` route |
| `src/components/layout/AppLayout.tsx` | Use `mode` to show different nav sets; add mode switcher in sidebar footer; change profile icon destination based on mode |
| `src/pages/Login.tsx` | After login, query roles and set initial mode + redirect |
| `src/contexts/TeamContext.tsx` | Remove auto-select logic (selectors start empty) |

### Selection Logic (deferred from previous plan)

- **Super Admin**: No auto-selection of association/club/team — selectors start empty
- **Association Admin**: Auto-select and lock their scoped association
- Mode switcher respects scoping

---

### Implementation Order

1. Create `AppModeContext` with mode state + localStorage persistence
2. Update `AppLayout` — mode-based nav, sidebar footer switcher, profile icon routing
3. Create `AssociationProfile` page
4. Update `Login.tsx` — role-based redirect + initial mode
5. Remove auto-select in `TeamContext`
6. Update plan as done
