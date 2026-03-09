

# Current Status & Next Steps

There are **two immediate items** to address before moving to new features:

## 1. Fix: UsersManagement page flickering (bug)
The `/admin/users` page is flickering because `useAdminScope.ts` creates new array references for `scopedAssociationIds`, `scopedClubIds`, and `scopedTeamIds` on every render (lines 79-81). This triggers infinite re-fetching in `UsersManagement.tsx`.

**Fix**: Wrap the scoped ID computation (lines 78-124) in `useMemo` depending on `[scopedRoles, allClubs, allTeams, loading]`.

| File | Change |
|------|--------|
| `src/hooks/useAdminScope.ts` | Memoize scoped ID arrays with `useMemo` |

## 2. Update plan.md
Add the completed team assignment redesign (4-level cascading selector, dual-frame Primary + Additional Teams) as a done item under Phase 2, item 3.

## After that, the next item on the plan is:
**#4 — Bulk player import**: Admin UI with XLSX file upload, data preview/validation table, and a `create-players-bulk` edge function. Reuses `ScopedTeamSelector`.

