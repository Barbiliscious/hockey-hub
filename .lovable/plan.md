

## Plan: Scoped Admin with Hierarchical Visibility

### Problem
`user_roles` has no scoping -- all admins see everything. Need: SUPER_ADMIN sees all, ASSOCIATION_ADMIN sees their association's clubs/teams/users, CLUB_ADMIN sees their club's teams/users, TEAM_MANAGER/COACH sees their team's users.

### 1. Database Migration -- Add scope columns to `user_roles`

```sql
ALTER TABLE user_roles
  ADD COLUMN association_id uuid REFERENCES associations(id) ON DELETE CASCADE,
  ADD COLUMN club_id uuid REFERENCES clubs(id) ON DELETE CASCADE,
  ADD COLUMN team_id uuid REFERENCES teams(id) ON DELETE CASCADE;
```

Rules enforced in code:
- SUPER_ADMIN: all nulls (global)
- ASSOCIATION_ADMIN: `association_id` set
- CLUB_ADMIN: `club_id` set
- TEAM_MANAGER/COACH: `team_id` set

### 2. New helper: `src/hooks/useAdminScope.ts`

Hook that reads the current user's scoped roles and returns:
- `scopedAssociationIds` -- associations the user can manage
- `scopedClubIds` -- clubs the user can manage
- `scopedTeamIds` -- teams the user can manage
- `canManageAssociation(id)`, `canManageClub(id)`, `canManageTeam(id)`

Logic:
- SUPER_ADMIN: returns all
- ASSOCIATION_ADMIN: returns their association + its clubs + its teams
- CLUB_ADMIN: returns their club + its teams
- TEAM_MANAGER/COACH: returns their team only

### 3. Update `src/pages/admin/AdminDashboard.tsx`

- Use `useAdminScope` to filter stat counts to scoped entities only
- Hide "Associations" card for CLUB_ADMIN and below
- Hide "Clubs" card for TEAM_MANAGER/COACH
- Show "Pending Memberships" section with count of pending memberships in scoped teams
- Show "Recent Activity" section (recent games, new members in scope)

### 4. Update `src/pages/admin/UsersManagement.tsx`

- Use `useAdminScope` to filter users to only those with memberships in scoped teams
- Add filters: status (Pending/Approved/All), team, club
- Show columns: Name, Email, Team(s), Membership Status, Roles
- SUPER_ADMIN: sees unassigned users (no team membership), can edit all fields
- ASSOCIATION_ADMIN: sees users in their association's teams, can assign roles up to CLUB_ADMIN
- CLUB_ADMIN: sees users in their club's teams, can assign TEAM_MANAGER/COACH
- TEAM_MANAGER/COACH: sees their team members, can approve/reject pending memberships
- Add "Approve" / "Reject" buttons for pending memberships inline
- Add ability to change user's team membership (move between teams in scope)

### 5. Update `src/pages/admin/TeamsManagement.tsx`

- Filter teams list to scoped teams/clubs only
- SUPER_ADMIN: dropdown + free text for association, club, division, gender
- ASSOCIATION_ADMIN: dropdown for club (filtered to their association), division, gender
- CLUB_ADMIN: their club pre-selected, dropdown for division, gender
- Replace delete with archive (`archived` column from previous plan)

### 6. Update `src/pages/admin/ClubsManagement.tsx`

- Filter to scoped clubs only
- CLUB_ADMIN: read-only view of their club
- ASSOCIATION_ADMIN: can add/edit clubs in their association
- SUPER_ADMIN: full access

### 7. Update `src/pages/admin/AssociationsManagement.tsx`

- Only visible to SUPER_ADMIN and ASSOCIATION_ADMIN
- ASSOCIATION_ADMIN: can only edit their own association
- SUPER_ADMIN: full CRUD

### 8. Update `UsersManagement.tsx` role assignment dialog

- When assigning ASSOCIATION_ADMIN: require selecting an association
- When assigning CLUB_ADMIN: require selecting a club
- When assigning TEAM_MANAGER/COACH: require selecting a team
- Scope dropdown options to what the current admin can manage

### 9. Update sidebar nav in `AppLayout.tsx`

- Show "Admin" nav item for any user with an admin/coach/manager role
- Single `/admin` link that leads to the scoped dashboard

### Files Changed

| File | Change |
|---|---|
| Migration SQL | Add `association_id`, `club_id`, `team_id` to `user_roles` |
| `src/hooks/useAdminScope.ts` | New -- scoped visibility hook |
| `src/pages/admin/AdminDashboard.tsx` | Scoped stats, pending memberships, activity |
| `src/pages/admin/UsersManagement.tsx` | Scoped user list, filters, approve/reject, role assignment with scope |
| `src/pages/admin/TeamsManagement.tsx` | Scoped list, role-based form controls |
| `src/pages/admin/ClubsManagement.tsx` | Scoped list, role-based access |
| `src/pages/admin/AssociationsManagement.tsx` | Scoped access |
| `src/components/layout/AppLayout.tsx` | Add Admin nav item for scoped roles |

