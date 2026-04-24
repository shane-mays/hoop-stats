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
import { LeaderboardSeason, LeaderboardStatKey } from 'interfaces';
import { formatAverage } from 'lib/util';

import {
  getPlayerRows,
  PlayerSortKey,
  sortArrow,
  SortDirection,
  statOptions,
} from './leaderboardShared';

type PlayerLeaderboardViewProps = {
  season: LeaderboardSeason;
  selectedStat: LeaderboardStatKey;
  sortKey: PlayerSortKey;
  sortDirection: SortDirection;
  onSelectStat: (stat: LeaderboardStatKey) => void;
  onSort: (sortKey: PlayerSortKey) => void;
};

export default function PlayerLeaderboardView(
  props: PlayerLeaderboardViewProps,
) {
  const { season, selectedStat, sortKey, sortDirection, onSelectStat, onSort } =
    props;

  const currentStat = statOptions.find(
    (option) => option.key === selectedStat,
  )!;
  const rows = getPlayerRows(
    season.players,
    selectedStat,
    sortKey,
    sortDirection,
  );
  const averageLeader = rows[0] ?? null;
  const totalLeader =
    [...rows].sort(
      (a, b) => b.total - a.total || a.name.localeCompare(b.name),
    )[0] ?? null;

  return (
    <Stack gap={4}>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={1}>
        <Box className={'overview-container'}>
          <Text className="label">
            {currentStat.shortLabel}{' '}
            {currentStat.label === 'Wins' ? '% Leader' : 'Avg Leader'}
          </Text>
          <Text className={'substat'}>{averageLeader?.name ?? '--'}</Text>
          <Text className="stat">
            {averageLeader ? formatAverage(averageLeader.average) : '--'}
          </Text>
        </Box>
        <Box className={'overview-container'}>
          <Text className="label">{currentStat.shortLabel} Total Leader</Text>
          <Text className="substat">{totalLeader?.name ?? '--'}</Text>
          <Text className="stat">
            {totalLeader ? formatAverage(totalLeader.total) : '--'}
          </Text>
        </Box>
      </SimpleGrid>

      <HStack flexWrap="wrap">
        {statOptions.map((option) => (
          <Button
            key={option.key}
            size="xs"
            minW="80px"
            variant={selectedStat === option.key ? 'solid' : 'outline'}
            colorPalette={option.color}
            onClick={() => onSelectStat(option.key)}
          >
            {option.label}
          </Button>
        ))}
      </HStack>

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Box px={4} py={2} borderBottomWidth="1px">
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
                <Table.ColumnHeader textAlign="center" w="35px" px={0}>
                  RK
                </Table.ColumnHeader>
                <Table.ColumnHeader data-sticky="start" left="0" minW="100px">
                  Player
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW="65px"
                  cursor="pointer"
                  onClick={() => onSort('average')}
                >
                  {selectedStat === 'wins' ? '%' : 'AVG'}
                  {sortArrow('average', sortKey, sortDirection)}
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  minW="85px"
                  cursor="pointer"
                  onClick={() => onSort('total')}
                >
                  TOTAL
                  {sortArrow('total', sortKey, sortDirection)}
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
                    {formatAverage(player.average)}
                  </Table.Cell>
                  <Table.Cell>{formatAverage(player.total)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Stack>
  );
}
