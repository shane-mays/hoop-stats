# Hoop Stats

Hoop Stats is a mobile-first basketball stat tracking app built with React, Vite, Chakra UI, React Router, and Supabase. It currently supports user selection, game creation, player history, game summaries, stat entry, and a season leaderboard view.

## Stack

- React 19
- Vite 7
- TypeScript
- Chakra UI 3
- React Router 7
- Supabase JS 2

## App Architecture

- `src/main.tsx` bootstraps the app, creates the router, and mounts shared providers.
- `src/App.tsx` provides the shared route shell, suspense fallback, footer navigation, and toaster.
- `src/features/*` contains feature-owned route screens, sections, hooks, and workflow components.
- `src/screens/*` now contains only route-level screens that have not been moved into a feature slice yet.
- `src/components/*` contains shared UI and cross-feature workflow components.
- `src/context/UserContext.tsx` stores the selected user and persists it in `localStorage`.
- `src/lib/supabaseApi.ts` contains the current Supabase client calls and RPC wrappers.

Current feature folders:

- `src/features/create-game`
- `src/features/game-summary`
- `src/features/player-profile`

## Routes

- `/` user selection and user creation
- `/create-game` create a new game and assign teams
- `/player/:id?` player history and profile view
- `/game/:gameId/` game summary and stat editing
- `/leaderboard` season stat leaderboards with sortable average and total columns
- `/team` placeholder screen

Navigation notes:

- `More` is now an action drawer in the footer nav, not a route.
- The More drawer currently includes Create Game, Teams, QR share, and an admin-only leaderboard refresh action.

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

- `npm run dev` start the local Vite dev server
- `npm run build` create a production build in `dist`
- `npm run lint` run ESLint on `src`
- `npm run lint-fix` run ESLint with autofix on `src`
- `npm test` run Vitest with coverage for the current pure helper test suite
- `npm run test:watch` run Vitest in watch mode
- `npm run typecheck` run TypeScript type checking without emitting files
- `npm run preview` preview the production build locally

## Leaderboard Notes

- The leaderboard screen now uses live data from Supabase through `get_current_leaderboard`.
- The current leaderboard UI surfaces `points`, `assists`, `steals`, `blocks`, and `threes`.
- Each stat view supports sorting by season average and season total.
- Rebounds remain in the shared type/backend contract for future use, but are not currently shown in the UI.

## Current Gaps

- `Team` is still a placeholder.
- There are no component or integration tests yet.
- Supabase schema and SQL migrations are not checked into this repository.
