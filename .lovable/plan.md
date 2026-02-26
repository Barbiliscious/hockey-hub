

## Plan: Replace Placeholder Seed Data with Correct Hockey Ballarat and Wimmera Data

### Overview

Delete all existing placeholder data (Hockey Victoria, Hockey NSW, Hockey Queensland and their clubs/teams/games) and insert the correct competition data for Hockey Ballarat and Wimmera Hockey associations, with all their clubs, home grounds, and teams -- sorted alphabetically.

### Step 1: Database Migration -- Clear Old Data and Insert New

A single migration that:

1. **Deletes all existing data** in dependency order: `lineups` -> `games` -> `teams` -> `clubs` -> `associations`
2. **Inserts 2 associations**: Hockey Ballarat, Wimmera (alphabetical)
3. **Inserts 13 clubs** with home grounds (alphabetical within each association):
   - Hockey Ballarat (7 clubs): Blaze HC, Bobcats HC, Ducks HC, Eureka and Golden City HC, Grampians HC, Lucas HC
   - Wimmera (6 clubs): Dimboola HC, Horsham HC, Kaniva HC, Nhill & District SC, Warracknabeal HC, Yanac HC
4. **Inserts all teams** per the provided data, using the correct `age_group`, `gender`, and `division` mappings:

| Team Description | age_group | gender | division |
|---|---|---|---|
| Open Div 1 | Open | Mixed | Division 1 |
| Open Div 2 | Open | Mixed | Division 2 |
| Women | Open | Women | Women Division 1 |
| Mixed Under 11 | Under 11 | Mixed | Junior |
| Mixed Under 12 | Under 12 | Mixed | Junior |
| Mixed Under 14 | Under 14 | Mixed | Junior |
| Mixed Under 16 | Under 16 | Mixed | Junior |
| Open (Wimmera) | Open | Mixed | Division 1 |
| Women (Wimmera) | Open | Women | Women Division 1 |  
| U16 (Wimmera) | Under 16 | Mixed | Junior |
| U12 (Wimmera) | Under 12 | Mixed | Junior |

### Clubs and Teams Breakdown

**Hockey Ballarat:**
- Blaze HC (Prince of Wales Park North) -- Open Div 1, Open Div 2, Women, Mixed Under 14, Mixed Under 16, Mixed Under 11
- Bobcats HC (Prince of Wales Park North) -- Open Div 1, Open Div 2, Women, Mixed Under 14, Mixed Under 16, Mixed Under 11
- Ducks HC (Prince of Wales Park South) -- Open Div 1, Women
- Eureka and Golden City HC (Prince of Wales Park South) -- Open Div 1, Open Div 2, Women, Mixed Under 14, Mixed Under 16, Mixed Under 11
- Grampians HC (Prince of Wales Park South) -- Open Div 2
- Lucas HC (Prince of Wales Park North) -- Open Div 1, Open Div 2, Women, Mixed Under 14, Mixed Under 16, Mixed Under 11

**Wimmera:** (each club has Open, Women, U16, U12)
- Dimboola HC (Dimboola Recreation Reserve)
- Horsham HC (Dimboola Recreation Reserve)
- Kaniva HC (Kaniva Recreation Reserve)
- Nhill & District SC (Nhill Town Oval)
- Warracknabeal HC (Warracknabeal Recreation Reserve)
- Yanac HC (Yanac Recreation Reserve)

### Step 2: No Code Changes Required

The admin pages (`AssociationsManagement`, `ClubsManagement`, `TeamsManagement`) already fetch data from the database dynamically. The new data will appear automatically once the migration runs. The clubs table already has a `home_ground` column from the earlier branding migration plan -- if that column doesn't exist yet, we will add it in this migration.

### Technical Details

- The `clubs` table currently lacks `home_ground`, `banner_url`, `primary_colour`, `secondary_colour` columns. This migration will add them (as planned in the earlier club branding discussion) so we can set `home_ground` values for each club.
- All IDs will use `gen_random_uuid()` (no hardcoded UUIDs) since there are no dependencies to maintain.
- Teams are alphabetically ordered within each club.
- The migration is safe because there are 0 team memberships and 0 lineups; the 5 existing games reference old placeholder teams and will be deleted.

### Files Changed

| File | Change |
|---|---|
| New migration | SQL to delete old data, add columns to clubs, insert associations/clubs/teams |

