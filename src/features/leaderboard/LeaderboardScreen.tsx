import { Button, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { CurrentLeaderboards, LeaderboardStatKey } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { getCurrentLeaderboards } from 'lib/supabaseApi';
import { formatDateAndTimeString } from 'lib/util';
import { useCallback, useEffect, useState } from 'react';

import {
  LeaderboardTab,
  PlayerSortKey,
  SortDirection,
  TeamGamesFilter,
  TeamSortKey,
} from './leaderboardShared';
import PlayerLeaderboardView from './PlayerLeaderboardView';
import TeamLeaderboardView from './TeamLeaderboardView';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('players');
  const [selectedStat, setSelectedStat] =
    useState<LeaderboardStatKey>('points');
  const [playerSortKey, setPlayerSortKey] = useState<PlayerSortKey>('average');
  const [playerSortDirection, setPlayerSortDirection] =
    useState<SortDirection>('desc');
  const [teamSortKey, setTeamSortKey] = useState<TeamSortKey>('winPct');
  const [teamSortDirection, setTeamSortDirection] =
    useState<SortDirection>('desc');
  const [teamGamesFilter, setTeamGamesFilter] =
    useState<TeamGamesFilter>('2plus');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [leaderboards, setLeaderboards] = useState<CurrentLeaderboards>();

  const loadLeaderboards = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const leaderboardData = await getCurrentLeaderboards();
      setLeaderboards(leaderboardData);
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Unable to load leaderboard.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboards();
  }, [loadLeaderboards]);

  if (isLoading) {
    return <LoadState title="Loading leaderboards" loading minH="240px" />;
  }

  if (loadError) {
    return (
      <LoadState
        title="Could not load leaderboards"
        description={loadError}
        actionLabel="Retry"
        onAction={loadLeaderboards}
        minH="240px"
      />
    );
  }

  if (!leaderboards) {
    return (
      <LoadState
        title="Leaderboard is empty"
        actionLabel="Retry"
        onAction={loadLeaderboards}
        minH="240px"
      />
    );
  }

  const playerSeason = leaderboards.playerLeaderboard;
  const teamSeason = leaderboards.teamLeaderboard;
  const currentSeasonLabel =
    activeTab === 'players'
      ? playerSeason.seasonLabel
      : teamSeason.seasonLabel || playerSeason.seasonLabel;
  const currentLastUpdated =
    activeTab === 'players'
      ? playerSeason.lastUpdated
      : teamSeason.lastUpdated || playerSeason.lastUpdated;

  const setPlayerSort = (nextSortKey: PlayerSortKey) => {
    if (playerSortKey === nextSortKey) {
      setPlayerSortDirection((current) =>
        current === 'desc' ? 'asc' : 'desc',
      );
      return;
    }

    setPlayerSortKey(nextSortKey);
  };

  const setTeamSort = (nextSortKey: TeamSortKey) => {
    if (teamSortKey === nextSortKey) {
      setTeamSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setTeamSortKey(nextSortKey);
  };

  return (
    <Stack p={0} pb="3.5rem" gap={4} pt={4}>
      <Stack px={4} gap={0}>
        <HStack justify="space-between" align="end">
          <Heading size="lg">Season Leaderboards</Heading>
        </HStack>
        <Text className="summary-label">{currentSeasonLabel}</Text>
        <Text className="created-at">
          Last updated {formatDateAndTimeString(currentLastUpdated)}
        </Text>
      </Stack>
      <div className="tabs-header">
        <div className="tabs-container">
          <div className="tabs">
            <Button
              variant={'plain'}
              className={`tab ${activeTab === 'players' ? ' active' : ''}`}
              onClick={() => setActiveTab('players')}
            >
              Players
            </Button>
            <Button
              variant={'plain'}
              className={`tab ${activeTab === 'teams' ? ' active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              Teams
            </Button>
          </div>
        </div>
      </div>

      <Stack gap={4} paddingBottom={1} px={2}>
        {activeTab === 'players' ? (
          <PlayerLeaderboardView
            season={playerSeason}
            selectedStat={selectedStat}
            sortKey={playerSortKey}
            sortDirection={playerSortDirection}
            onSelectStat={setSelectedStat}
            onSort={setPlayerSort}
          />
        ) : (
          <TeamLeaderboardView
            season={teamSeason}
            sortKey={teamSortKey}
            sortDirection={teamSortDirection}
            gamesFilter={teamGamesFilter}
            onSort={setTeamSort}
            onGamesFilterChange={setTeamGamesFilter}
          />
        )}
      </Stack>
    </Stack>
  );
}
