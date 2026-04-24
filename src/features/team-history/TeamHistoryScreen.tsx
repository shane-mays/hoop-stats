import { Heading, ScrollArea, Stack, Text } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { useUser } from 'context/UserContext';
import usePageUser from 'features/player-profile/usePageUser';
import { useParams } from 'react-router-dom';

import TeamCombinationsSection from './TeamCombinationsSection';
import TeamHistorySummarySection from './TeamHistorySummarySection';
import useTeamHistoryData from './useTeamHistoryData';

export default function TeamHistoryScreen() {
  const { selectedUser } = useUser();
  const { id: routePublicUserId } = useParams<{ id?: string }>();

  const { pageUser, isLoadingUser, userLoadError, loadPageUser } = usePageUser(
    routePublicUserId,
    selectedUser,
  );

  const { combinations, isLoading, loadError, loadTeamHistory } =
    useTeamHistoryData(pageUser?.id);

  if (isLoadingUser) {
    return <LoadState title="Loading player" loading minH="200px" />;
  }

  if (userLoadError) {
    return (
      <LoadState
        title="Could not load player"
        description={userLoadError}
        actionLabel="Retry"
        onAction={loadPageUser}
        minH="200px"
      />
    );
  }

  if (!pageUser) {
    return (
      <LoadState
        title="No player selected"
        description="Select a player first to view team combination history."
        minH="240px"
      />
    );
  }

  return (
    <Stack className="screen-container">
      <Stack px={2} gap={0}>
        <Heading size="lg">Teams</Heading>
        <Text className="summary-label">
          Best-performing lineups for {pageUser.name}
        </Text>
      </Stack>

      <ScrollArea.Root flex={1}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            <Stack gap={4}>
              <TeamHistorySummarySection
                combinations={combinations}
                isLoading={isLoading}
                error={loadError}
                onRetry={loadTeamHistory}
              />
              <TeamCombinationsSection
                combinations={combinations}
                isLoading={isLoading}
                error={loadError}
                onRetry={loadTeamHistory}
              />
            </Stack>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    </Stack>
  );
}
