# Hoop Stats

Hoop Stats is a full-stack basketball stat tracking platform designed for fast, mobile-first data entry and real-time performance analytics.

The app replaces manual stat tracking with a structured system for capturing game data, generating box scores, and computing long-term player performance through efficient SQL aggregation.


## Product Focus

The current experience is optimized for mobile and tablet portrait workflows, with an emphasis on fast stat entry and lightweight navigation. Desktop and landscape-specific layouts are planned for a future iteration.

## Key Features

- Create and manage games with dynamic team assignment  
- Track player stats with fast, mobile-optimized input flows  
- Generate real-time box scores and game summaries  
- View player history and performance trends  
- Leaderboard system with sortable averages and totals  
- Designed for efficient long-term stat aggregation using SQL views  

## Technical Highlights

- Designed relational data models for games, teams, players, and stats using PostgreSQL  
- Built aggregation and leaderboard system using SQL views and pre-computation strategies  
- Optimized queries to return full game data (teams, players, stats) in a single request  
- Implemented upsert patterns for stat submission with conflict handling  
- Architected frontend using a feature-based structure for scalability and maintainability  

## Stack

- React 19
- Vite 7
- TypeScript
- Chakra UI
- React Router
- Supabase (PostgreSQL, RPC, Realtime)

## App Architecture

- `src/main.tsx` bootstraps the app and initializes routing and providers
- `src/App.tsx` provides shared layout, navigation, and global UI components
- `src/features/*` contains feature-specific logic, components, and workflows
- `src/components/*` contains reusable UI components
- `src/context/UserContext.tsx` stores the selected user and persists it in `localStorage`
- `src/lib/supabaseApi.ts` contains API calls and RPC wrappers for Supabase client

## Routes

- `/` user selection and creation
- `/create-game` create a new game and assign teams
- `/player/:id?` player history and profile view
- `/game/:gameId/` game summary and stat editing
- `/leaderboard` season stat leaderboards with sortable averages and totals

## Backend

The application uses Supabase (PostgreSQL) for data storage and backend logic.

Key backend features include:

- Relational schema for users, games, teams, and player stats  
- SQL views for box scores and aggregated performance data  
- RPC functions for game creation, completion, and leaderboard updates  

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

3. Fill in the required Supabase values in `.env`.

4. Start the dev server:

```bash
npm run dev
```

The Vite dev server runs on port `5174` by default.

## Environment Variables

The app expects the following values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

See `.env.example` for the expected shape.

## Supabase Backend Contract

This frontend assumes a pre-existing Supabase project with:

- a `users` table
- a `player_stats` table
- a `recent_game_summary` view or table-like query source
- a `game_box_score` view or table-like query source
- a `create_game_with_teams` RPC
- a `complete_game` RPC
- a `get_current_leaderboard` RPC
- a `refresh_current_leaderboard` RPC for the admin-only More drawer action

The current frontend-side contract is documented in `docs/SUPABASE.md`.

## Available Scripts

- `npm run dev` start the Vite dev server  
- `npm run build` create a production build  
- `npm run preview` preview production build locally  
- `npm run lint` run ESLint  
- `npm run lint-fix` fix ESLint issues  
- `npm test` run Vitest with coverage for the current pure helper test suite
- `npm run test:watch` run Vitest in watch mode
- `npm run typecheck` run TypeScript checks  

## Leaderboard Notes

- The leaderboard screen now uses live data from Supabase through `get_current_leaderboard`.
- The current leaderboard UI surfaces `points`, `assists`, `steals`, `blocks`, and `threes`.
- Each stat view supports sorting by season average and season total.
- Rebounds remain in the shared type/backend contract for future use, but are not currently shown in the UI.

## Current Gaps

- `Team` is still a placeholder. Need to add functionality.
- There are no component or integration tests yet.
- Supabase schema and SQL migrations are not checked into this repository.
