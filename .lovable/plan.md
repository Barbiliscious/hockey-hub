

## Plan: 5-Mode App System

### Modes

| Mode | Roles | Landing | Profile Icon | Nav Items |
|---|---|---|---|---|
| **Super Admin** | SUPER_ADMIN | `/admin` | Association settings page | Associations, Clubs, Teams, Users |
| **Association** | ASSOCIATION_ADMIN | `/admin` | Association settings page (scoped) | Clubs, Teams, Users |
| **Club** | CLUB_ADMIN | `/admin` | Club settings page | Teams, Users, Club Settings |
| **Team** | TEAM_MANAGER, COACH | `/dashboard` | Personal profile | Dashboard, Fixtures, Lineups, Roster, Chat |
| **Player** | PLAYER (or no admin role) | `/dashboard` | Personal profile | Dashboard, Fixtures, Stats, Chat |

### How It Works

- **On login**: query `user_roles`, determine highest role, set initial mode accordingly, redirect to appropriate landing page.
- **Mode switching**: Users with multiple role levels see a "Switch Mode" button in the sidebar footer. Only modes the user actually has roles for are available.
- **Mode persisted** to `localStorage` so it survives refreshes.
- **Navigation completely changes** per mode -- each mode has its own sidebar nav set.
- **Header selectors** (association/club/team) adapt per mode: Super Admin sees all unlocked; Association Admin has their association locked; Club Admin has association+club locked; Team/Player modes show their team context.

### Files to Create

| File | Purpose |
|---|---|
| `src/contexts/AppModeContext.tsx` | Mode state, available modes from roles, localStorage persistence, mode switcher logic |
| `src/pages/admin/AssociationProfile.tsx` | Full association settings/branding page (name, logo, stats, config) |

### Files to Modify

| File | Change |
|---|---|
| `src/App.tsx` | Wrap with `AppModeProvider`, add `/admin/association-profile` route |
| `src/components/layout/AppLayout.tsx` | Replace current nav logic with mode-based nav sets; add mode switcher in sidebar footer; change profile icon destination per mode; adapt header selectors per mode |
| `src/pages/Login.tsx` | After login, query `user_roles`, set initial mode, redirect to mode's landing page |
| `src/contexts/TeamContext.tsx` | Remove auto-select logic (lines 80-90) so selectors start empty |
| `.lovable/plan.md` | Update with this plan |

### AppModeContext Shape

```text
type AppMode = "super_admin" | "association" | "club" | "team" | "player"

interface AppModeContextType {
  mode: AppMode
  setMode: (mode: AppMode) => void
  availableModes: AppMode[]       // derived from user_roles
  canSwitchMode: boolean          // availableModes.length > 1
}
```

Default mode on login = highest available mode. Persisted to `localStorage`.

### Nav Sets Per Mode

```text
Super Admin:  Associations, Clubs, Teams, Users
Association:  Clubs, Teams, Users
Club:         Teams, Users, Club Settings
Team:         Dashboard, Fixtures, Lineups, Roster, Chat
Player:       Dashboard, Fixtures, Stats, Chat
```

### Sidebar Footer Mode Switcher

- Only visible when `canSwitchMode` is true
- Shows current mode label (e.g. "Association Mode")
- Dropdown or list of other available modes to switch to
- Placed above the Logout button

### Implementation Order

1. Create `AppModeContext` with mode derivation from roles + localStorage
2. Update `AppLayout` -- mode-based nav, footer switcher, profile icon routing, header selector locking
3. Create `AssociationProfile` page
4. Update `Login.tsx` -- role query + mode-based redirect
5. Remove auto-select in `TeamContext`
6. Update `.lovable/plan.md`

