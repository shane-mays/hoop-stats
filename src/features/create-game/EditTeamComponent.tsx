import { HStack, Icon, IconButton, Stack } from '@chakra-ui/react';
import { User } from 'interfaces';
import { IoIosRemoveCircleOutline } from 'react-icons/io';
import { TbCircleLetterCFilled } from 'react-icons/tb';

import PlayerSelectDialog from './PlayerSelectDialog';
import { TeamHook } from './useTeam';

type EditTeamComponentProps = {
  teamName: string;
  team: TeamHook;
  users: User[];
  selectedPlayers: User[];
};

export const EditTeamComponent = ({
  teamName,
  team,
  users,
  selectedPlayers,
}: EditTeamComponentProps) => {
  return (
    <Stack width={'50%'} bgColor={'bg.emphasized'} padding={2}>
      <div>{teamName}</div>
      {team.team.map((user, i) => (
        <HStack justifyContent={'space-between'} key={user.id}>
          <div>
            {i == 0 && (
              <Icon color={'yellow'} verticalAlign={'baseline'} size={'xs'}>
                <TbCircleLetterCFilled />
              </Icon>
            )}
            {user.name}
          </div>
          <IconButton
            variant={'ghost'}
            color={'red'}
            size={'xs'}
            onClick={() => {
              team.remove(user.id);
            }}
          >
            <IoIosRemoveCircleOutline />
          </IconButton>
        </HStack>
      ))}
      <PlayerSelectDialog
        players={users}
        selectedPlayers={selectedPlayers}
        addPlayer={team.add}
      />
    </Stack>
  );
};
