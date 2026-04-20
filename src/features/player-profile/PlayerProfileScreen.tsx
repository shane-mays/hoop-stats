import { Drawer, ScrollArea, Stack } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { useUser } from 'context/UserContext';
import GameSummaryScreen from 'features/game-summary/GameSummaryScreen';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import PlayerProfileHeader from './PlayerProfileHeader';
import PlayerSeasonStatSection from './PlayerSeasonStatSection';
import RecentGamesSection from './RecentGamesSection';
import TopTeammatesSection from './TopTeammatesSection';
import usePageUser from './usePageUser';
import usePlayerHistoryData from './usePlayerHistoryData';

export default function PlayerProfileScreen() {
  const { selectedUser } = useUser();
  const { id: routePublicUserId } = useParams<{ id?: string }>();
  const [open, setOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | undefined>(
    undefined,
  );
  const { pageUser, isLoadingUser, userLoadError, loadPageUser } = usePageUser(
    routePublicUserId,
    selectedUser,
  );
  const {
    seasonStats,
    isLoadingSeasonStats,
    seasonStatsLoadError,
    loadPlayerSeasonStats,
    recentGames,
    isLoadingGames,
    gamesLoadError,
    loadPlayerHistory,
    topTeammates,
    isLoadingTeammates,
    teammatesLoadError,
    loadTopTeammates,
    refresh,
  } = usePlayerHistoryData(pageUser?.id);

  const openGameSummaryDrawer = (publicId: string) => {
    setOpen(true);
    setSelectedGameId(publicId);
  };

  return (
    <Drawer.Root
      placement={'bottom'}
      unmountOnExit={true}
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
      }}
    >
      <Stack paddingTop={4} paddingBottom={'3.5rem'} h={'100dvh'}>
        <PlayerProfileHeader pageUser={pageUser} onRefresh={refresh} />

        <ScrollArea.Root flex={1}>
          <ScrollArea.Viewport>
            <ScrollArea.Content>
              {isLoadingUser ? (
                <LoadState title="Loading player" loading minH="200px" />
              ) : userLoadError ? (
                <LoadState
                  title="Could not load player"
                  description={userLoadError}
                  actionLabel="Retry"
                  onAction={loadPageUser}
                  minH="200px"
                />
              ) : (
                <Stack gap={4} paddingBottom={1}>
                  <PlayerSeasonStatSection
                    seasonStats={seasonStats}
                    isLoading={isLoadingSeasonStats}
                    error={seasonStatsLoadError}
                    onRetry={loadPlayerSeasonStats}
                  />
                  <TopTeammatesSection
                    teammates={topTeammates}
                    isLoading={isLoadingTeammates}
                    error={teammatesLoadError}
                    onRetry={loadTopTeammates}
                  />
                  <RecentGamesSection
                    games={recentGames}
                    isLoading={isLoadingGames}
                    error={gamesLoadError}
                    onRetry={loadPlayerHistory}
                    onOpenGame={openGameSummaryDrawer}
                  />
                </Stack>
              )}
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea.Root>
      </Stack>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <GameSummaryScreen
            publicId={selectedGameId}
            onGameUpdated={refresh}
          />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
