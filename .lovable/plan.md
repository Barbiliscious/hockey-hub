

# Implement: Redesigned Team Assignment & Form Tweaks

Everything from the initial Add Player implementation is already in place. This step applies the redesign discussed in the latest approved plan.

## Changes

### 1. `src/components/admin/ScopedTeamSelector.tsx`
Add **Division** as a 4th cascading level between Club and Team Name:
- Fetch teams with `division` column: `select("id, name, club_id, division")`
- Add `selectedDivision` state
- After club is selected, compute distinct divisions from filtered teams
- After division is selected, filter teams to that division
- Render as a 4-column grid: Association > Club > Division > Team Name
- Reset downstream selections on each upstream change

### 2. `src/pages/admin/AddPlayer.tsx`
**Dual-frame team assignment:**
- **Top Card: "Primary Team"** — one `ScopedTeamSelector`, always `membership_type = PRIMARY`
- **Bottom Card: "Additional Teams"** — dynamic list of rows, each with its own `ScopedTeamSelector` + type selector (PERMANENT / FILL_IN) + remove button. "Add Team" button appends a new row.
- Form state changes from single `team_id` to:
  - `primaryTeamId: string`
  - `additionalTeams: Array<{ team_id: string, membership_type: "PERMANENT" | "FILL_IN" }>`
- Change `suburb` field from `<Input>` to `<Textarea>`
- Submit sends `team_assignments` array to edge function

### 3. `supabase/functions/create-player/index.ts`
- Change payload from single `team_id + membership_type` to `team_assignments: Array<{ team_id, membership_type }>`
- Validate at least one PRIMARY assignment
- Scope-check **each** team_id in the array
- Insert multiple `team_memberships` rows and one `user_role` (PLAYER) per unique team

### 4. `src/components/profile/PersonalDetailsSection.tsx`
- Change suburb/address field from `<Input>` to `<Textarea>` when editing

### Files

| File | Action |
|------|--------|
| `src/components/admin/ScopedTeamSelector.tsx` | Add division as 4th cascading level |
| `src/pages/admin/AddPlayer.tsx` | Dual-frame Primary + Additional Teams; textarea for address |
| `supabase/functions/create-player/index.ts` | Accept `team_assignments` array with per-team scope validation |
| `src/components/profile/PersonalDetailsSection.tsx` | Change address to textarea |

No database migrations needed — `division` already exists on `teams`.

