

## Plan: Update Team Display to "{Division} {Gender}" Format

### Current State
- 36 teams across 12 clubs, each with Open (gender=Mixed), Women, Juniors
- Names stored as "{Club} Open", "{Club} Women", "{Club} Juniors"
- Junior teams have no division, gender="Mixed"
- Need to expand each club's 1 Junior team into 4 age-group teams

### Data Changes (via insert tool)

1. **Delete** 12 Junior teams (confirmed no memberships/games linked)
2. **Insert** 48 new teams (4 per club): Under 11 Open, Under 12 Open, Under 14 Open, Under 16 Open
3. **Update** existing Open teams: gender "Mixed" → "Open", name → "Division 1 Open"
4. **Update** existing Women teams: name → "Division 1 Women"

### Code Changes

| File | Change |
|---|---|
| `src/lib/utils.ts` | Add `getTeamDisplayName(team)` — returns `{division} {gender}` falling back to `team.name` |
| `src/components/layout/AppLayout.tsx` (line 241) | Team selector: show `getTeamDisplayName(team)` instead of `team.name` |
| `src/pages/Dashboard.tsx` | Use helper for `teamName` |
| `src/pages/Games.tsx` | Use helper for `teamName` |
| `src/pages/GameDetail.tsx` | Use helper for `teamName` |
| `src/pages/Lineup.tsx` | Use helper for `teamName` |
| `src/pages/admin/TeamsManagement.tsx` | Replace free-text division/gender inputs with dropdowns (Division 1, Division 2, Under 11, Under 12, Under 14, Under 16 / Open, Women). Auto-generate name as `{Division} {Gender}` on save. |

### Helper Function

```typescript
export function getTeamDisplayName(team: { division?: string | null; gender?: string | null; name: string }) {
  if (team.division && team.gender) return `${team.division} ${team.gender}`;
  return team.name;
}
```

