import { HStack, Stack, Text } from '@chakra-ui/react';
import { TeamCombinationSummary } from 'interfaces';
import { formatAverage, formatTimeAgo } from 'lib/util';

type TeamCombinationItemProps = {
  combination: TeamCombinationSummary;
  rank: number;
};

export default function TeamCombinationItem(props: TeamCombinationItemProps) {
  const { combination, rank } = props;

  const rowClass =
    combination.winPct >= 50 ? 'match-row win-row' : 'match-row loss-row';

  return (
    <Stack gap={2} marginX={1} className={rowClass}>
      <HStack justifyContent="space-between" width="100%" gap={0}>
        <Stack gap={0} alignItems="start" minW={0}>
          <HStack flexWrap="wrap" gap={2}>
            <Text color="whiteAlpha.500" fontWeight="bold" lineHeight={1.1}>
              {rank}
            </Text>
            <Text fontWeight="bold" lineHeight={1.1}>
              {combination.players.map((player) => player.name).join(' / ')}
            </Text>
          </HStack>
          <Text className="time-started">
            {combination.lastPlayedAt
              ? `Last played ${formatTimeAgo(combination.lastPlayedAt)}`
              : 'No completed games yet'}
          </Text>
        </Stack>

        <Stack gap={0} align="end" flexShrink={0}>
          <Text className="mode">{combination.gamesPlayed} GP</Text>
          <Text fontWeight="bold" fontSize="1rem" lineHeight={1.25}>
            {combination.winPct.toFixed(1)}%
          </Text>
        </Stack>
      </HStack>

      <HStack justifyContent="space-between" width="100%">
        <Stack align="end" gap={0}>
          <Text className="summary-label">Record</Text>
          <Text className="stats-val">
            {combination.wins}-{combination.losses}
          </Text>
        </Stack>
        <Stack align="end" gap={0}>
          <Text className="summary-label">PF</Text>
          <Text className="stats-val">
            {formatAverage(combination.pointsForAvg)}
          </Text>
        </Stack>
        <Stack align="end" gap={0}>
          <Text className="summary-label">PA</Text>
          <Text className="stats-val">
            {formatAverage(combination.pointsAgainstAvg)}
          </Text>
        </Stack>
        <Stack align="end" gap={0}>
          <Text className="summary-label">Diff</Text>
          <Text className="stats-val">
            {combination.pointDiffAvg > 0 ? '+' : ''}
            {formatAverage(combination.pointDiffAvg)}
          </Text>
        </Stack>
      </HStack>
    </Stack>
  );
}
