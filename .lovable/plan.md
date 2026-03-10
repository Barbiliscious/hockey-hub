

# Next Step: Bulk Player Import (Phase 2, Item #4)

The flickering fix is done. The next item on the plan is **Bulk Player Import** — an admin page to upload an XLSX/CSV file of players, preview and validate the data, then bulk-create accounts and team memberships.

## What gets built

### 1. New dependency
- Add `xlsx` (SheetJS) for client-side spreadsheet parsing

### 2. New admin page: `src/pages/admin/BulkImport.tsx`
- `ScopedTeamSelector` at top to set the association/club scope for the import
- File upload (`.xlsx` / `.csv`) parsed client-side with `xlsx`
- Preview table showing: Row #, First Name, Last Name, Email, Gender, DOB, HV Number, Club, Division, Status (valid/error)
- Validation: required fields (first_name, last_name), club+division must resolve to a known team in scope
- Submit button sends valid rows to edge function
- Results summary: X created, Y failed with per-row error details

### 3. New edge function: `supabase/functions/bulk-import/index.ts`
- Auth check + scope validation (same pattern as `create-player`)
- Build lookup map: `(club_name, division)` → `team_id` within the caller's scope
- For each row:
  - Generate mock email if none provided (`firstname.lastname@grampianshockey.mock`)
  - Create auth user via `admin.createUser`
  - Update profile with all fields
  - Insert `team_memberships` (PRIMARY) and `user_roles` (PLAYER)
- Return `{ created: number, errors: Array<{ row: number, error: string }> }`

### 4. Config & routing
- Add `[functions.bulk-import]` with `verify_jwt = false` to `supabase/config.toml`
- Add route `/admin/bulk-import` in `App.tsx`
- Update `plan.md`

## Files

| File | Action |
|------|--------|
| `src/pages/admin/BulkImport.tsx` | Create — file upload, preview table, validation, submit |
| `supabase/functions/bulk-import/index.ts` | Create — bulk account creation with scope validation |
| `supabase/config.toml` | Add bulk-import function config |
| `src/App.tsx` | Add route |
| `.lovable/plan.md` | Mark #4 as done |

