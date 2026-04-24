import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import { TeamLeaderboardSeason } from 'interfaces';
import { formatAverage } from 'lib/util';

import {
  getTeamLineupLabel,
  getTeamRows,
  sortArrow,
  SortDirection,
  teamFilterOptions,
  TeamGamesFilter,
  TeamSortKey,
  teamSortOptions,
} from './leaderboardShared';

type TeamLeaderboardViewProps = {
  season: TeamLeaderboardSeason;
  sortKey: TeamSortKey;
  sortDirection: SortDirection;
  gamesFilter: TeamGamesFilter;
  onSort: (sortKey: TeamSortKey) => void;
  onGamesFilterChange: (filter: TeamGamesFilter) => void;
};

export default function TeamLeaderboardView(props: TeamLeaderboardViewProps) {
  const {
    season,
    sortKey,
    sortDirection,
    gamesFilter,
    onSort,
    onGamesFilterChange,
  } = props;

  const minimumGames =
    teamFilterOptions.find((option) => option.key === gamesFilter)
      ?.minimumGames ?? 0;

  const rows = getTeamRows(
    season.combinations,
    minimumGames,
    sortKey,
    sortDirection,
  );

  const teamDiffLeader =
    [...rows].sort(
      (a, b) =>
        b.pointDiffAvg - a.pointDiffAvg ||
        getTeamLineupLabel(a).localeCompare(getTeamLineupLabel(b)),
    )[0] ?? null;
  const teamGamesLeader =
    [...rows].sort(
      (a, b) =>
        b.gamesPlayed - a.gamesPlayed ||
        getTeamLineupLabel(a).localeCompare(getTeamLineupLabel(b)),
    )[0] ?? null;

  return (
    <Stack gap={4}>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={1}>
        <Box borderWidth="1px" borderRadius="lg" p={3}>
          <Text className="summary-label">Best Point Diff</Text>
          <Text fontWeight="bold" lineClamp={2} fontSize={14}>
            {teamDiffLeader ? getTeamLineupLabel(teamDiffLeader) : '--'}
          </Text>
          <Text className="stats-val" fontSize={14}>
            {teamDiffLeader
              ? `${teamDiffLeader.pointDiffAvg > 0 ? '+' : ''}${formatAverage(
                  teamDiffLeader.pointDiffAvg,
                )}`
              : '--'}
          </Text>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={3}>
          <Text className="summary-label">Most Played</Text>
          <Text fontWeight="bold" lineClamp={2} fontSize={14}>
            {teamGamesLeader ? getTeamLineupLabel(teamGamesLeader) : '--'}
          </Text>
          <Text className="stats-val" fontSize={14}>
            {teamGamesLeader ? `${teamGamesLeader.gamesPlayed}` : '--'}
          </Text>
        </Box>
      </SimpleGrid>

      <Stack gap={2}>
        <Text className="summary-label">Filter Games Played</Text>
        <HStack gap={2} flexWrap="wrap">
          {teamFilterOptions.map((option) => (
            <Button
              key={option.key}
              size="sm"
              variant={gamesFilter === option.key ? 'solid' : 'surface'}
              colorPalette={option.color}
              onClick={() => onGamesFilterChange(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </HStack>
      </Stack>

      <Stack gap={2}>
        <Text className="summary-label">Sort Teams By</Text>
        <HStack gap={2} flexWrap="wrap">
          {teamSortOptions.map((option) => (
            <Button
              key={option.key}
              size="sm"
              variant={sortKey === option.key ? 'solid' : 'surface'}
              colorPalette={'cyan'}
              onClick={() => onSort(option.key)}
            >
              {option.label}
              {sortArrow(option.key, sortKey, sortDirection)}
            </Button>
          ))}
        </HStack>
      </Stack>

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Box px={4} py={3} borderBottomWidth="1px">
          <Heading size="md">Team Lineup Leaderboard</Heading>
        </Box>
        {rows.length === 0 ? (
          <Box p={4}>
            <Text>No teams match this filter.</Text>
          </Box>
        ) : (
          <Table.ScrollArea>
            <Table.Root
              striped
              stickyHeader
              css={{
                '& [data-sticky]': {
                  position: 'sticky',
                  zIndex: 1,
                  bg: 'bg',
                  _after: {
                    content: '""',
                    position: 'absolute',
                    pointerEvents: 'none',
                    top: '0',
                    bottom: '-1px',
                    width: '24px',
                  },
                },
                '& [data-sticky=start]': {
                  _after: {
                    insetInlineStart: '0',
                    translate: '-100% 0',
                    shadow: 'inset -8px 0px 8px -8px rgba(0, 0, 0, 0.16)',
                  },
                },
                '& thead tr': {
                  shadow: '0 1px 0 0 {colors.border}',
                },
              }}
            >
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader textAlign="center" w="40px">
                    RK
                  </Table.ColumnHeader>
                  <Table.ColumnHeader data-sticky="start" left="0" minW="180px">
                    Team
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW="65px">W-L</Table.ColumnHeader>
                  <Table.ColumnHeader
                    minW="75px"
                    cursor="pointer"
                    onClick={() => onSort('winPct')}
                  >
                    WIN %{sortArrow('winPct', sortKey, sortDirection)}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader
                    minW="65px"
                    cursor="pointer"
                    onClick={() => onSort('gamesPlayed')}
                  >
                    GP
                    {sortArrow('gamesPlayed', sortKey, sortDirection)}
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW="65px">PF</Table.ColumnHeader>
                  <Table.ColumnHeader minW="65px">PA</Table.ColumnHeader>
                  <Table.ColumnHeader
                    minW="75px"
                    cursor="pointer"
                    onClick={() => onSort('pointDiffAvg')}
                  >
                    DIFF
                    {sortArrow('pointDiffAvg', sortKey, sortDirection)}
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map((team, index) => (
                  <Table.Row key={team.combinationKey}>
                    <Table.Cell textAlign="center" fontWeight="bold">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell data-sticky="start" left="0">
                      <Stack gap={0}>
                        <Text fontWeight="bold" lineHeight={1.1}>
                          {getTeamLineupLabel(team)}
                        </Text>
                        <Text className="summary-label">
                          {team.players.length} players
                        </Text>
                      </Stack>
                    </Table.Cell>
                    <Table.Cell fontWeight="bold">
                      {team.wins}-{team.losses}
                    </Table.Cell>
                    <Table.Cell>{formatAverage(team.winPct)}%</Table.Cell>
                    <Table.Cell>{team.gamesPlayed}</Table.Cell>
                    <Table.Cell>{formatAverage(team.pointsForAvg)}</Table.Cell>
                    <Table.Cell>
                      {formatAverage(team.pointsAgainstAvg)}
                    </Table.Cell>
                    <Table.Cell fontWeight="bold">
                      {team.pointDiffAvg > 0 ? '+' : ''}
                      {formatAverage(team.pointDiffAvg)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        )}
      </Box>
    </Stack>
  );
}
