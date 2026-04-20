import { HStack, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import { GameBoxScoreType, GameScoringEnum } from 'interfaces';
import { formatDateAndTimeString, timeDuration } from 'lib/util';
import { MouseEventHandler } from 'react';
import { IoMdOpen } from 'react-icons/io';
import { IoReload } from 'react-icons/io5';
import { RiTimerLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import RunItBackDialog from './RunItBackDialog';

type GameSummaryHeaderProps = {
  onReload: MouseEventHandler<HTMLButtonElement>;
  onRunItBack?: () => void;
  gameBoxScore: GameBoxScoreType;
  publicId: string | undefined;
};

export default function GameSummaryHeader(props: GameSummaryHeaderProps) {
  const navigate = useNavigate();
  const { onReload, onRunItBack, publicId, gameBoxScore } = props;

  return (
    <HStack justify="space-between" px={1} mb={4}>
      <Stack gap={2}>
        <Stack gap={0}>
          <Text className={'score-type'}>
            {gameBoxScore.scoring == GameScoringEnum.TWOS_AND_THREES
              ? '2s and 3s'
              : '1s and 2s'}
          </Text>
          <Text fontWeight={'bold'} fontSize={'1rem'} lineHeight={1.25}>
            {gameBoxScore.location}
          </Text>
        </Stack>
        <Text className={'created-at'}>
          {formatDateAndTimeString(gameBoxScore.createdAt)}
        </Text>
      </Stack>
      <Stack gap={2}>
        <RunItBackDialog
          gameBoxScore={gameBoxScore}
          {...(onRunItBack ? { onCreated: onRunItBack } : {})}
        />
        <HStack>
          <Icon size={'sm'} color={'#D0CFE5'}>
            <RiTimerLine />
          </Icon>
          <Text className={'time-duration'}>
            {timeDuration(gameBoxScore.createdAt, gameBoxScore.completedAt)}
          </Text>
        </HStack>
      </Stack>
      <HStack gap={0}>
        {publicId && (
          <IconButton
            variant={'ghost'}
            onClick={() => navigate(`/game/${publicId}`)}
          >
            <IoMdOpen />
          </IconButton>
        )}
        <IconButton onClick={onReload} variant={'ghost'}>
          <IoReload />
        </IconButton>
      </HStack>
    </HStack>
  );
}
