import { Avatar, HStack, IconButton, Text } from '@chakra-ui/react';
import { User } from 'interfaces';
import { IoReload } from 'react-icons/io5';

type PlayerProfileHeaderProps = {
  pageUser: User | undefined;
  onRefresh: () => void;
};

export default function PlayerProfileHeader(props: PlayerProfileHeaderProps) {
  const { pageUser, onRefresh } = props;

  return (
    <HStack px={4} justify="space-between">
      <HStack>
        <Avatar.Root>
          <Avatar.Fallback />
        </Avatar.Root>
        <div>
          <Text fontWeight="bold">{pageUser?.name}</Text>
          <Text>{pageUser?.username}</Text>
        </div>
      </HStack>
      <IconButton onClick={onRefresh} variant="ghost">
        <IoReload />
      </IconButton>
    </HStack>
  );
}
