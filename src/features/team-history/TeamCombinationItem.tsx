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
    <Stack gap={2} className={rowClass}>
      <HStack justifyContent="space-between" width="100%" gap={0}>
        <Stack gap={0} alignItems="start" minW={0}>
          <HStack flexWrap="wrap" gap={2}>
            <Text
              fontSize={'.75rem'}
              color="whiteAlpha.600"
              fontWeight={500}
              lineHeight={1.15}
            >
              {rank}
            </Text>
            <Text className="time-started">
              {combination.lastPlayedAt
                ? `Last played ${formatTimeAgo(combination.lastPlayedAt)}`
                : 'No completed games yet'}
            </Text>
          </HStack>
          <Text
            fontSize={'1rem'}
            color="white"
            fontWeight={700}
            lineHeight={1.125}
          >
            {combination.players.map((player) => player.name).join(' / ')}
          </Text>
        </Stack>

        <Stack gap={0} align="end" flexShrink={0}>
          <Text className="mode">{combination.gamesPlayed} GP</Text>
          <Text fontWeight="bold" fontSize="1rem" lineHeight={1}>
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
