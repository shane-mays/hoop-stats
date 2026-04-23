import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { LeaderboardSeason, LeaderboardStatKey } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { getCurrentLeaderboard } from 'lib/supabaseApi';
import { formatDateAndTimeString } from 'lib/util';
import { useCallback, useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

type SortKey = 'average' | 'total';
type SortDirection = 'asc' | 'desc';

const statOptions: {
  key: LeaderboardStatKey;
  label: string;
  shortLabel: string;
  color: string;
}[] = [
  { key: 'points', label: 'Points', shortLabel: 'PTS', color: 'cyan' },
  { key: 'threes', label: 'Threes', shortLabel: '3PT', color: 'pink' },
  { key: 'assists', label: 'Assists', shortLabel: 'AST', color: 'orange' },
  { key: 'steals', label: 'Steals', shortLabel: 'STL', color: 'yellow' },
  { key: 'blocks', label: 'Blocks', shortLabel: 'BLK', color: 'purple' },
  { key: 'wins', label: 'Wins', shortLabel: 'Win', color: 'green' },
];

const formatNumber = (value: number) => {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

const sortArrow = (
  sortKey: SortKey,
  activeSortKey: SortKey,
  direction: SortDirection,
) => {
  if (sortKey !== activeSortKey) return '';
  return (
    <Icon marginLeft={1} size={'xs'}>
      {direction === 'desc' ? <IoIosArrowDown /> : <IoIosArrowUp />}
    </Icon>
  );
};

export default function LeaderboardScreen() {
  const [selectedStat, setSelectedStat] =
    useState<LeaderboardStatKey>('points');
  const [sortKey, setSortKey] = useState<SortKey>('average');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [seasonData, setSeasonData] = useState<LeaderboardSeason | undefined>();

  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const leaderboardSeasonData = await getCurrentLeaderboard();
      setSeasonData(leaderboardSeasonData);
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Unable to load leaderboard.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const currentStat = statOptions.find(
    (option) => option.key === selectedStat,
  )!;

  if (isLoading)
    return <LoadState title="Loading leaderboard" loading minH="240px" />;
  if (loadError)
    return (
      <LoadState
        title="Could not load leaderboard"
        description={loadError}
        actionLabel="Retry"
        onAction={loadLeaderboard}
        minH="240px"
      />
    );
  if (!seasonData)
    return (
      <LoadState
        title="Leaderboard is empty"
        actionLabel="Retry"
        onAction={loadLeaderboard}
        minH="240px"
      />
    );

  const rows = seasonData.players
    .map((player) => {
      const statLine = player.stats[selectedStat];
      return {
        ...player,
        average: statLine.average,
        total: statLine.total,
      };
    })
    .sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      const result =
        aValue === bValue ? a.name.localeCompare(b.name) : bValue - aValue;

      return sortDirection === 'desc' ? result : -result;
    });

  const averageLeader = rows[0] ?? null;
  const totalLeader =
    [...rows].sort(
      (a, b) => b.total - a.total || a.name.localeCompare(b.name),
    )[0] ?? null;

  const setSort = (nextSortKey: SortKey) => {
    if (sortKey === nextSortKey) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortKey(nextSortKey);
  };

  return (
    <Stack p={4} pb="3.5rem" gap={4}>
      <Stack gap={0}>
        <HStack justify="space-between" align="end">
          <Heading size="lg">Season Leaderboards</Heading>
        </HStack>
        <Text className="summary-label">{seasonData.seasonLabel}</Text>
        <Text className="created-at">
          Last updated {formatDateAndTimeString(seasonData.lastUpdated)}
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
        <Box borderWidth="1px" borderRadius="lg" p={3}>
          <Text className="summary-label">
            {currentStat.shortLabel}{' '}
            {currentStat.label === 'Wins' ? '% Leader' : 'Avg Leader'}
          </Text>
          <Text fontWeight="bold">{averageLeader?.name ?? '--'}</Text>
          <Text className="stats-val">
            {averageLeader ? formatNumber(averageLeader.average) : '--'}
          </Text>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" p={3}>
          <Text className="summary-label">
            {currentStat.shortLabel} Total Leader
          </Text>
          <Text fontWeight="bold">{totalLeader?.name ?? '--'}</Text>
          <Text className="stats-val">
            {totalLeader ? formatNumber(totalLeader.total) : '--'}
          </Text>
        </Box>
      </SimpleGrid>

      <Stack gap={2}>
        <Text className="summary-label">Select Stat</Text>
        <HStack gap={2} flexWrap="wrap">
          {statOptions.map((option) => (
            <Button
              key={option.key}
              size="sm"
              minW="75px"
              variant={selectedStat === option.key ? 'solid' : 'surface'}
              colorPalette={option.color}
              onClick={() => setSelectedStat(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </HStack>
      </Stack>

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Box px={4} py={3} borderBottomWidth="1px">
          <Heading size="md">{currentStat.label} Leaderboard</Heading>
          <Text className="created-at">
            Tap any column header to sort by average or total.
          </Text>
        </Box>
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
                <Table.ColumnHeader data-sticky="start" left="0" minW="100px">
                  Player
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW={'65px'}
                  cursor="pointer"
                  onClick={() => setSort('average')}
                >
                  {selectedStat == ('wins' as LeaderboardStatKey) ? '%' : 'AVG'}
                  {sortArrow('average', sortKey, sortDirection)}
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW={'85px'}
                  cursor="pointer"
                  onClick={() => setSort('total')}
                >
                  TOTAL{sortArrow('total', sortKey, sortDirection)}
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows.map((player, index) => (
                <Table.Row key={player.userId}>
                  <Table.Cell textAlign="center" fontWeight="bold">
                    {index + 1}
                  </Table.Cell>
                  <Table.Cell data-sticky="start" left="0">
                    <Stack gap={0}>
                      <Text fontWeight="bold" lineHeight={1.1}>
                        {player.name}
                      </Text>
                      <Text className="summary-label">@{player.username}</Text>
                    </Stack>
                  </Table.Cell>
                  <Table.Cell fontWeight="bold">
                    {formatNumber(player.average)}
                  </Table.Cell>
                  <Table.Cell>{formatNumber(player.total)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Stack>
  );
}
