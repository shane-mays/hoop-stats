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
import { LeaderboardStatKey, PlayerSeasonStats } from 'interfaces';

type PlayerSeasonStatSectionProps = {
  seasonStats: PlayerSeasonStats | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function PlayerSeasonStatSection(
  props: PlayerSeasonStatSectionProps,
) {
  const { seasonStats, isLoading, error, onRetry } = props;

  const statLabels: Record<LeaderboardStatKey, string> = {
    points: 'Points',
    assists: 'Assists',
    steals: 'Steals',
    blocks: 'Blocks',
    threes: 'Threes',
    wins: 'Wins',
  };

  const statOrder: LeaderboardStatKey[] = [
    'points',
    'threes',
    'assists',
    'steals',
    'blocks',
  ];

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatAverage = (value: number) => {
    return Number.isInteger(value) ? formatNumber(value) : value.toFixed(1);
  };

  type StatCardProps = {
    label: string;
    total: number;
    average?: number;
  };

  const StatCard = ({ label, total, average }: StatCardProps) => {
    return (
      <Box bg="bg.panel" borderWidth="1px" borderRadius=".5rem" px={2} py={1}>
        <HStack justify={'space-between'}>
          <VStack gap={0} align={'baseline'}>
            <Text
              fontSize="sm"
              fontWeight="medium"
              lineHeight="short"
              color={'#D0CFE5'}
            >
              {label}
            </Text>
            {average !== undefined ? (
              <Text fontSize="xs" color="fg.muted">
                {'Avg ' + formatAverage(average)}
              </Text>
            ) : null}
          </VStack>
          <Text fontSize="md" fontWeight="bold" lineHeight="1">
            {formatNumber(total)}
          </Text>
        </HStack>
      </Box>
    );
  };

  if (isLoading) {
    return <LoadState title="Loading Season Stats" loading minH="120px" />;
  }

  if (error) {
    return (
      <LoadState
        title="Could not load season stats"
        description={error}
        actionLabel="Retry"
        onAction={onRetry}
        minH="120px"
      />
    );
  }

  if (seasonStats === null) {
    return (
      <LoadState
        title="Seasons Stats is empty"
        description="Once enough completed games are logged, season stats will show up here."
        minH="120px"
      />
    );
  }

  return (
    <Stack gap={1}>
      <Heading px={4} size="md" alignSelf="start">
        Season Stats
      </Heading>

      <Grid
        templateColumns={{
          base: 'repeat(3, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        }}
        gap={1}
        px={1}
      >
        <Box bg="bg.panel" borderWidth="1px" borderRadius=".5rem" px={2} py={1}>
          <HStack justify={'space-between'}>
            <VStack gap={0} align={'baseline'}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                lineHeight="short"
                color={'#D0CFE5'}
              >
                Record
              </Text>
              <Text fontSize="xs" color="fg.muted">
                {seasonStats.stats.wins.average}%
              </Text>
            </VStack>
            <Text fontSize="md" fontWeight="bold" lineHeight="1">
              {seasonStats.stats.wins.total} - {seasonStats.stats.losses}
            </Text>
          </HStack>
        </Box>
        {statOrder.map((key) => (
          <StatCard
            key={key}
            label={statLabels[key]}
            total={seasonStats.stats[key].total}
            average={seasonStats.stats[key].average}
          />
        ))}
      </Grid>
    </Stack>
  );
}
