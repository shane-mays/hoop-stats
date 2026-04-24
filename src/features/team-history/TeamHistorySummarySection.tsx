import { Box, Grid, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { TeamCombinationSummary } from 'interfaces';
import { formatAverage } from 'lib/util';

type TeamHistorySummarySectionProps = {
  combinations: TeamCombinationSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function TeamHistorySummarySection(
  props: TeamHistorySummarySectionProps,
) {
  const { combinations, isLoading, error, onRetry } = props;

  if (isLoading) {
    return <LoadState title="Loading team history" loading minH="120px" />;
  }

  if (error) {
    return (
      <LoadState
        title="Could not load team history"
        description={error}
        actionLabel="Retry"
        onAction={onRetry}
        minH="120px"
      />
    );
  }

  if (combinations.length === 0) {
    return (
      <LoadState
        title="No team combinations yet"
        description="Once enough completed games are logged, lineup history will show up here."
        minH="120px"
      />
    );
  }

  const mostPlayed = [...combinations].sort(
    (a, b) => b.gamesPlayed - a.gamesPlayed || b.winPct - a.winPct,
  )[0];
  const totalGames = combinations.reduce(
    (sum, combination) => sum + combination.gamesPlayed,
    0,
  );
  const mostPlayedLineup = mostPlayed!;

  const lineupLabel = (combination: TeamCombinationSummary) => {
    return combination.players.map((player) => player.name).join(' / ');
  };

  return (
    <Stack gap={1}>
      <Grid
        templateColumns={{
          base: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        }}
        gap={1}
      >
        <Box className={'overview-container'}>
          <HStack justify={'space-between'}>
            <Text className="label">Total Lineups</Text>
            <Text className="stat">{combinations.length}</Text>
          </HStack>
        </Box>
        <Box className={'overview-container'}>
          <HStack justify={'space-between'}>
            <Text className="label">Total Games</Text>
            <Text className="stat">{totalGames}</Text>
          </HStack>
        </Box>
        <Box
          className={'overview-container'}
          gridColumn={{ base: 'span 2', md: 'span 3' }}
        >
          <HStack justify="space-between" align="start">
            <VStack gap={0} align="baseline" minW={0}>
              <Text className="label">Most Played Lineup</Text>
              <Text className="substat" lineClamp={2}>
                {lineupLabel(mostPlayedLineup)}
              </Text>
            </VStack>
            <Text className="stat">{mostPlayedLineup.gamesPlayed} GP</Text>
          </HStack>
          <Text className="substat">
            {formatAverage(mostPlayedLineup.pointsForAvg)} scored /{' '}
            {formatAverage(mostPlayedLineup.pointsAgainstAvg)} allowed
          </Text>
        </Box>
      </Grid>
    </Stack>
  );
}
