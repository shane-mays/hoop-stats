import 'css/App.css';

import { ChakraProvider, defaultSystem, Theme } from '@chakra-ui/react';
import { AppErrorBoundary } from 'components/AppErrorBoundary';
import { UserProvider } from 'context/UserContext';
import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import AppLayout from './App';

const UserSelectScreen = lazy(() => import('screens/UserSelectScreen'));
const CreateGameScreen = lazy(
  () => import('features/create-game/CreateGameScreen'),
);
const LeaderboardScreen = lazy(
  () => import('features/leaderboard/LeaderboardScreen'),
);
const PlayerProfileScreen = lazy(
  () => import('features/player-profile/PlayerProfileScreen'),
);
const TeamHistoryScreen = lazy(
  () => import('features/team-history/TeamHistoryScreen'),
);
const GameSummaryScreen = lazy(
  () => import('features/game-summary/GameSummaryScreen'),
);

const container = document.getElementById('root');

if (!container) throw new Error('Root container not found');

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <AppErrorBoundary />,
    children: [
      { index: true, element: <UserSelectScreen /> },
      { path: 'create-game', element: <CreateGameScreen /> },
      { path: 'player/:id?', element: <PlayerProfileScreen /> },
      { path: 'game/:gameId/', element: <GameSummaryScreen /> },
      { path: 'leaderboard', element: <LeaderboardScreen /> },
      { path: 'teams/:id?', element: <TeamHistoryScreen /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(container).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Theme appearance="dark" colorPalette="cyan">
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </Theme>
    </ChakraProvider>
  </StrictMode>,
);
