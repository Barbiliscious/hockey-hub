

# Full Implementation Plan -- Item by Item

Here is every item on the roadmap, walked through one at a time.

---

## 1. Sunraysia Hockey Association Setup

**What:** Insert the "Sunraysia Hockey Association" into the database with its 4 clubs -- Koowinda, Wanderers, Riverside, and Waratahs -- and create teams under each club for the relevant divisions (Division 1 Open, Division 1 Women, U13, U16, etc.).

**Why:** This data is needed before any player or fixture import can work. Two associations (Ballarat, Wimmera) already exist; Sunraysia is the missing third.

**Scope:** Database inserts only (no code changes). Uses the data insert tool to add rows to `associations`, `clubs`, and `teams` tables.

---

## 2. Team Nicknames

**What:** Add a `nickname` column to the `teams` table. Optional in general, but mandatory when multiple teams from the same club exist in the same division. Display as "Division 1 Open -- Thunderbolts" throughout the app.

**Why:** Clubs like Koowinda may field two teams in the same division. Without a nickname, you cannot distinguish them.

**Scope:** One DB migration (add column), then update `TeamsManagement.tsx` to show a nickname field with validation, and update team name display components across the app.

---

## 3. Bulk Player Import

**What:** Build an edge function and admin UI page to import players from the uploaded XLSX spreadsheet. The edge function creates auth accounts (with generated mock emails), profiles, team memberships, and PLAYER role assignments. The admin page parses the XLSX client-side, shows a preview table, then sends data to the edge function.

**Why:** ~300 player-team rows need importing. Manual entry is not feasible.

**Scope:**
- Add `xlsx` npm package
- Create edge function `supabase/functions/bulk-import/index.ts`
- Create `src/pages/admin/BulkImport.tsx` with file upload, preview, and import trigger
- Add `/admin/import` route and link from Admin Dashboard

---

## 4. Bulk Fixture Import

**What:** Similar to player import but for the ~540 fixture rows. Resolves club names + divisions to `team_id` values and inserts into the `games` table.

**Why:** Full 2026 season fixtures are ready in the spreadsheet.

**Scope:** Can share the same edge function and admin page as the player import (second tab/section). Needs team ID resolution logic (association + club + division -> team_id).

---

## 5. Player Exceptions / Compliance System

**What:** A `player_exceptions` table that flags issues like missing date of birth, age ineligibility for age-group teams (U16 = must be <=16 as of Dec 31), missing emergency contacts, etc. A database function `refresh_player_exceptions(team_id)` scans members and generates/updates exception rows. An admin page at `/admin/exceptions` lets admins and managers view, filter, and resolve flags.

**Why:** Competition rules require age checks. Admins need visibility into incomplete player registrations.

**Scope:**
- DB migration: create `player_exceptions` table + RLS + refresh function
- Create `src/pages/admin/ExceptionsList.tsx`
- Add exceptions count badge to Admin Dashboard
- Add `/admin/exceptions` route

---

## 6. Seasons Table and Competition Standings

**What:** Create a `seasons` table (e.g., "2026 Season 1") to group games. Build a standings/ladder page that auto-calculates wins, losses, draws, and points from completed game results. Add a `season_id` column to `games`.

**Why:** Currently games have no season grouping. Standings are a core feature for any competition platform.

**Scope:**
- DB migration: `seasons` table, add `season_id` to `games`
- Create `src/pages/Standings.tsx` with ladder calculation logic
- Add nav link in Team/Player modes

---

## 7. Player Statistics Tracking

**What:** Track per-game stats: goals, green/yellow/red cards, best-on-ground votes. Create a `player_game_stats` table. Build a season leaderboard view showing top scorers, most cards, etc.

**Why:** Stats are expected in any team sport app. Coaches and players want to see performance data.

**Scope:**
- DB migration: `player_game_stats` table + RLS
- Add stats entry UI to GameDetail page (for coaches/managers)
- Create `src/pages/Stats.tsx` leaderboard page
- Wire into Player mode nav ("Stats" link already planned)

---

## 8. Club Branding in Player-Facing UI

**What:** The `clubs` table already has `primary_colour`, `secondary_colour`, `logo_url`, and `banner_url` columns. Wire these into the player-facing dashboard so team headers, cards, and sidebar elements reflect the club's colours and logo.

**Why:** Makes the app feel personalized per club. The data fields exist but are unused in the UI.

**Scope:** Update `AppLayout.tsx` header, `Dashboard.tsx`, and team-related components to pull club branding from the current team context and apply it as CSS variables or inline styles.

---

## 9. Dark Mode Toggle

**What:** The `next-themes` package is already installed. Add a theme toggle button (sun/moon icon) to the sidebar footer or header. Persist preference.

**Why:** Quality-of-life feature. The package is already a dependency, just needs wiring up.

**Scope:** Small -- add a `ThemeToggle` component, place it in `AppLayout.tsx`, ensure Tailwind dark classes are applied consistently.

---

## 10. Audit Log

**What:** Create an `audit_log` table that records admin actions: role changes, membership approvals/rejections, team transfers, player removals. Viewable by Super Admin and Association Admin.

**Why:** Accountability. When something changes, admins need to know who did it and when.

**Scope:**
- DB migration: `audit_log` table + RLS (read-only for admins)
- Add logging calls in existing admin action handlers
- Create a simple log viewer page or section in Admin Dashboard

---

## 11. Update the Plan File

**What:** Rewrite `.lovable/plan.md` to reflect that the 5-mode system is complete and track all of the above as the next phase, with status indicators.

**Why:** The current plan is stale -- it still describes the mode system as future work.

---

## Suggested Implementation Order

| Priority | Item | Dependencies |
|----------|------|-------------|
| 1 | Sunraysia Association Setup | None |
| 2 | Team Nicknames | None |
| 3 | Bulk Player Import | Sunraysia data, nicknames |
| 4 | Bulk Fixture Import | Sunraysia data, nicknames |
| 5 | Player Exceptions | Player data imported |
| 6 | Seasons + Standings | Fixtures imported |
| 7 | Player Stats | Games exist |
| 8 | Club Branding | Nice-to-have, no deps |
| 9 | Dark Mode | Nice-to-have, no deps |
| 10 | Audit Log | Nice-to-have, no deps |
| 11 | Update Plan File | After deciding scope |

