# Supabase Contract

This repository currently contains the frontend only. The app depends on an existing Supabase project and expects the following database objects to exist.

## Environment

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

These are read in `src/supabaseClient.js`.

## Tables

### `users`

Expected fields used by the frontend:

- `id`
- `public_id`
- `name`
- `username`

Frontend usage:

- create user
- fetch all users
- fetch user by internal id
- fetch user by public id
- update user

### `player_stats`

Expected fields used by the frontend:

- `game_id`
- `user_id`
- `team_id`
- `points`
- `ones`
- `twos`
- `threes`
- `assists`
- `blocks`
- `rebounds`
- `steals`

The frontend upserts on the composite conflict key `game_id,user_id`.

## Views or Query Sources

### `recent_game_summary`

Expected columns inferred from the frontend type contract:

- `courtSize`
- `createdAt`
- `gameId`
- `location`
- `status`
- `targetScore`
- `teams`
- `userId`
- `gamePublicId`
- `didWin`
- `isMvp`
- `userStats`
- `awayTeam`
- `homeTeam`
- `scoringType`

Used by the player history screen.

### `game_box_score`

Expected columns inferred from the frontend type contract:

- `public_id`
- `id`
- `scoring`
- `status`
- `courtSize`
- `location`
- `targetScore`
- `createdAt`
- `completedAt`
- `teams`

Used by the game summary screen and related stat-editing flows.

## RPC Functions

### `create_game_with_teams`

Expected arguments:

- `p_target_score`
- `p_scoring`
- `p_court_size`
- `p_location`
- `p_team1_name`
- `p_team2_name`
- `p_team1_users`
- `p_team2_users`

Used when creating a game and when running a game back with the same lineups.

### `complete_game`

Expected arguments:

- `p_game_id`
- `p_winning_team_id`

Used when marking a pending game as complete.

### `get_current_leaderboard`

Expected return shape:

- `seasonLabel`
- `lastUpdated`
- `players`

Each player is expected to include:

- `userId`
- `name`
- `username`
- `team`
- `gamesPlayed`
- `wins`
- `losses`
- `stats`

Each `stats` object is expected to include entries for:

- `points`
- `assists`
- `rebounds`
- `steals`
- `blocks`
- `threes`

Each stat entry is expected to include:

- `total`
- `average`

Used by the leaderboard screen.

### `refresh_current_leaderboard`

Expected behavior:

- refreshes or rebuilds the current season leaderboard data source used by `get_current_leaderboard`

Used by:

- the admin-only `Update Leaderboard` action in the More drawer

### `get_top_teammates`

Expected arguments:

- `p_user_id`

Expected return shape:

- `userId`
- `name`
- `username`
- `gamesTogether`
- `winsTogether`
- `lossesTogether`
- `winPercentage`

Used by:

- the player profile `Top Teammates` section

### `get_player_current_season_stats`

Expected arguments:

- `p_user_id`

Expected return shape:

- `seasonId`
- `seasonLabel`
- `lastUpdated`
- `stats`

The `stats` object is expected to include:

- `points`
- `assists`
- `steals`
- `blocks`
- `threes`
- `wins`
- `losses`
- `totalGamesPlayed`
- `statGamesPlayed`

Each leaderboard stat entry is expected to include:

- `total`
- `average`

Used by:

- the player profile season stats section

### `get_user_team_combinations`

Expected arguments:

- `p_user_id`

Expected return shape:

- an array of lineup combination objects

Each lineup combination object is expected to include:

- `combinationKey`
- `players`
- `gamesPlayed`
- `wins`
- `losses`
- `winPct`
- `pointsForAvg`
- `pointsAgainstAvg`
- `pointDiffAvg`
- `lastPlayedAt`

Each `players` entry is expected to include:

- `id`
- `name`
- `username`

Used by:

- the team history screen

Current frontend note:

- `winPct` is currently treated as a percentage value already scaled to `0-100`, not a `0-1` ratio.

Current frontend note:

- The leaderboard UI currently surfaces `points`, `assists`, `steals`, `blocks`, and `threes`.
- `rebounds` is still expected in the shared contract for future use, even though it is not currently rendered in the leaderboard UI.

## Frontend Service Module

All current frontend-side Supabase access is centralized in `src/lib/supabaseApi.ts`. If the backend contract changes, that file and the related TypeScript interfaces are the first places to update.
