import { HStack, Stack, Text } from '@chakra-ui/react';
import { GameScoringEnum, GameStatusEnum, RecentGame } from 'interfaces';
import { formatTimeAgo } from 'lib/util';

export default function RecentGameItem({
  gameSummary,
  openDrawer,
}: {
  gameSummary: RecentGame;
  openDrawer: (publicId: string) => void;
}) {
  const winClass =
    gameSummary.status === GameStatusEnum.COMPLETED
      ? gameSummary.didWin
        ? ' win-row'
        : ' loss-row'
      : '';
  return (
    <Stack
      gap={2}
      className={'match-row' + winClass}
      onClick={() => openDrawer(gameSummary.gamePublicId)}
    >
      <HStack justifyContent={'space-between'} width={'100%'} gap={0}>
        <Stack gap={0} alignItems={'start'}>
          <HStack gap={2}>
            <Stack gap={0}>
              <Text className={'time-started'}>
                {formatTimeAgo(gameSummary.createdAt)}
              </Text>
              <HStack gap={'0.3rem'}>
                <Text className={'home-points'}>
                  {gameSummary.homeTeam.teamPoints}
                </Text>
                <Text className={'colon'}>:</Text>
                <Text className={'away-points'}>
                  {gameSummary.awayTeam.teamPoints}
                </Text>
              </HStack>
            </Stack>
            {gameSummary.isMvp && gameSummary.didWin && (
              <span className={'mvp'}>MVP</span>
            )}
            {gameSummary.isMvp && !gameSummary.didWin && (
              <span className={'svp'}>SVP</span>
            )}
          </HStack>
        </Stack>
        <Stack gap={0} align={'end'}>
          <Text className={'mode'}>
            {gameSummary.scoringType == GameScoringEnum.TWOS_AND_THREES
              ? '2s and 3s'
              : '1s and 2s'}
          </Text>
          <Text fontWeight={'bold'} fontSize={'1rem'} lineHeight={1.25}>
            {gameSummary.location}
          </Text>
        </Stack>
      </HStack>
      <HStack justifyContent={'space-between'} width={'100%'}>
        <Stack align={'end'} gap={0}>
          <Text className={'summary-label'}>Points</Text>
          <Text className={'stats-val'}>{gameSummary.userStats.points}</Text>
        </Stack>
        <Stack align={'end'} gap={0}>
          <Text className={'summary-label'}>Steals</Text>
          <Text className={'stats-val'}>{gameSummary.userStats.steals}</Text>
        </Stack>
        <Stack align={'end'} gap={0}>
          <Text className={'summary-label'}>Assists</Text>
          <Text className={'stats-val'}>{gameSummary.userStats.assists}</Text>
        </Stack>
        <Stack align={'end'} gap={0}>
          <Text className={'summary-label'}>Blocks</Text>
          <Text className={'stats-val'}>{gameSummary.userStats.blocks}</Text>
        </Stack>
      </HStack>
    </Stack>
  );
}
