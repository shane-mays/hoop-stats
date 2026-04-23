import {
  Box,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
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
  const bestWinPct = combinations[0];
  const totalGames = combinations.reduce(
    (sum, combination) => sum + combination.gamesPlayed,
    0,
  );
  const bestWinPctLineup = bestWinPct!;
  const mostPlayedLineup = mostPlayed!;

  const lineupLabel = (combination: TeamCombinationSummary) => {
    return combination.players.map((player) => player.name).join(' / ');
  };

  return (
    <Stack gap={1}>
      <Heading px={4} size="md" alignSelf="start">
        Summary
      </Heading>

      <Grid
        templateColumns={{
          base: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        }}
        gap={1}
        px={1}
      >
        <Box bg="bg.panel" borderWidth="1px" borderRadius=".5rem" px={2} py={1}>
          <VStack gap={0} align="baseline">
            <Text fontSize="sm" fontWeight="medium" color="#D0CFE5">
              Team Combos
            </Text>
            <Text fontSize="md" fontWeight="bold" lineHeight="1">
              {combinations.length}
            </Text>
          </VStack>
        </Box>
        <Box bg="bg.panel" borderWidth="1px" borderRadius=".5rem" px={2} py={1}>
          <VStack gap={0} align="baseline">
            <Text fontSize="sm" fontWeight="medium" color="#D0CFE5">
              Combo Games
            </Text>
            <Text fontSize="md" fontWeight="bold" lineHeight="1">
              {totalGames}
            </Text>
          </VStack>
        </Box>
        <Box
          bg="bg.panel"
          borderWidth="1px"
          borderRadius=".5rem"
          px={2}
          py={1}
          gridColumn={{ base: 'span 2', md: 'span 1' }}
        >
          <HStack justify="space-between" align="start">
            <VStack gap={0} align="baseline" minW={0}>
              <Text fontSize="sm" fontWeight="medium" color="#D0CFE5">
                Best Lineup
              </Text>
              <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                {lineupLabel(bestWinPctLineup)}
              </Text>
            </VStack>
            <Text fontSize="md" fontWeight="bold" lineHeight="1" flexShrink={0}>
              {bestWinPctLineup.winPct.toFixed(1)}%
            </Text>
          </HStack>
        </Box>
        <Box
          bg="bg.panel"
          borderWidth="1px"
          borderRadius=".5rem"
          px={2}
          py={1}
          gridColumn={{ base: 'span 2', md: 'span 3' }}
        >
          <HStack justify="space-between" align="start">
            <VStack gap={0} align="baseline" minW={0}>
              <Text fontSize="sm" fontWeight="medium" color="#D0CFE5">
                Most Played Lineup
              </Text>
              <Text fontSize="xs" color="fg.muted" lineClamp={2}>
                {lineupLabel(mostPlayedLineup)}
              </Text>
            </VStack>
            <Text fontSize="md" fontWeight="bold" lineHeight="1" flexShrink={0}>
              {mostPlayedLineup.gamesPlayed} GP
            </Text>
          </HStack>
          <Text fontSize="xs" color="fg.muted" mt={1}>
            {formatAverage(mostPlayedLineup.pointsForAvg)} scored /{' '}
            {formatAverage(mostPlayedLineup.pointsAgainstAvg)} allowed
          </Text>
        </Box>
      </Grid>
    </Stack>
  );
}
