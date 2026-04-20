import { HStack, Icon, IconButton, Table, Text } from '@chakra-ui/react';
import { GameScoringEnum, Player } from 'interfaces';
import { FaEdit } from 'react-icons/fa';
import { TbCircleLetterCFilled } from 'react-icons/tb';

export const PlayerStatRow = ({
  player,
  canEdit,
  onEditPlayer,
  scoringType,
  didWin,
}: {
  player: Player;
  canEdit: boolean;
  onEditPlayer: (playerId: string) => void;
  scoringType: GameScoringEnum;
  didWin: boolean;
}) => {
  const navToUpdateStats = () => {
    onEditPlayer(player.userId);
  };

  return (
    <Table.Row>
      <Table.Cell data-sticky="end" left="0" p={0}>
        <HStack justifyContent={'space-between'} px={2}>
          <HStack gap={0} align={'center'}>
            {player.isCaptain && (
              <Icon color={'yellow'} verticalAlign={'baseline'} size={'xs'}>
                <TbCircleLetterCFilled />
              </Icon>
            )}
            <Text lineHeight={2} fontSize={'small'} paddingRight={4}>
              {player.name}
            </Text>
            {player.isMvp && didWin && <span className={'mvp'}>MVP</span>}
            {player.isMvp && !didWin && <span className={'svp'}>SVP</span>}
          </HStack>
          {canEdit && (
            <IconButton
              variant={'ghost'}
              size={'2xs'}
              onClick={navToUpdateStats}
            >
              <FaEdit />
            </IconButton>
          )}
        </HStack>
      </Table.Cell>
      <Table.Cell p={0} textAlign={'center'} fontSize={'smaller'}>
        {player.stats.points}
      </Table.Cell>
      {scoringType === GameScoringEnum.ONES_AND_TWOS && (
        <Table.Cell p={0} textAlign={'center'} fontSize={'smaller'}>
          {player.stats.ones}
        </Table.Cell>
      )}
      <Table.Cell p={0} textAlign={'center'} fontSize={'smaller'}>
        {player.stats.twos}
      </Table.Cell>
      {scoringType === GameScoringEnum.TWOS_AND_THREES && (
        <Table.Cell p={0} textAlign={'center'} fontSize={'smaller'}>
          {player.stats.threes}
        </Table.Cell>
      )}
      <Table.Cell p={0} textAlign={'center'} fontSize={'smaller'}>
        {player.stats.assists}
      </Table.Cell>
      <Table.Cell p={0} textAlign={'center'} fontSize={'smaller'}>
        {player.stats.steals}
      </Table.Cell>
      <Table.Cell p={0} textAlign={'center'} fontSize={'smaller'}>
        {player.stats.blocks}
      </Table.Cell>
    </Table.Row>
  );
};
