import {
  Dialog,
  IconButton,
  Listbox,
  ListboxValueChangeDetails,
  Span,
  useListCollection,
} from '@chakra-ui/react';
import { User } from 'interfaces';
import { useEffect } from 'react';
import { LuPlus } from 'react-icons/lu';

type PlayerSelectProps = {
  players: User[];
  selectedPlayers: User[];
  addPlayer: (playerId: string) => void;
};

export default function PlayerSelectDialog(props: PlayerSelectProps) {
  let { players, selectedPlayers, addPlayer } = props;

  const { collection, set, filter } = useListCollection({
    initialItems: [] as User[],
    itemToValue: (u) => u.id,
  });

  const handleSelectionChange = (details: ListboxValueChangeDetails) => {
    if (details?.value?.[0]) {
      addPlayer(details.value[0]);
    }

    filter('');
  };

  useEffect(() => {
    const availablePlayers = players.filter(
      (p) => !selectedPlayers.some((sp) => sp.id === p.id),
    );
    set(availablePlayers);
  }, [players, selectedPlayers, set]);

  return (
    <Dialog.Root unmountOnExit>
      <Dialog.Trigger asChild>
        <IconButton variant={'outline'} width={'35%'} alignSelf={'center'}>
          <LuPlus />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Player Select</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Listbox.Root
              key={players.length}
              collection={collection}
              onValueChange={handleSelectionChange}
              variant="plain"
            >
              <Listbox.Content px="3" maxH="300px">
                {collection.items.map((item, i) => (
                  <Listbox.Item
                    item={item}
                    key={i}
                    justifyContent="space-between"
                  >
                    <Listbox.ItemText>{item.name}</Listbox.ItemText>
                    <Span fontSize="xs" color="fg.muted">
                      {item.username}
                    </Span>
                  </Listbox.Item>
                ))}
              </Listbox.Content>
            </Listbox.Root>
          </Dialog.Body>
          <Dialog.Footer />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
