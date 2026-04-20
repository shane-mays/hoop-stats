import 'css/App.css';

import {
  Button,
  Dialog,
  HStack,
  Image,
  NativeSelect,
  Stack,
} from '@chakra-ui/react';
import splash from 'assets/VerticalSplash.webp';
import CreateUserForm from 'components/CreateUserForm';
import LoadState from 'components/LoadState';
import { useUser } from 'context/UserContext';
import { User } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { getAllUsers } from 'lib/supabaseApi';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserSelectScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectUser, setSelectUser] = useState<User>();
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setLoadError(null);
    try {
      const data = await getAllUsers();
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Unable to load users.'));
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const user = users.find((u) => u.id === e.target.value);
    setSelectUser(user);
  };

  const navigateToPlayerScreen = () => {
    if (!selectUser) return;
    setCurrentUser(selectUser);
    navigate(`/player/${selectUser.publicId}`);
  };

  return (
    <Stack align={'center'} height={'95dvh'} justifyContent={'end'}>
      <Image
        rounded="md"
        height={'100dvh'}
        fit="contain"
        src={splash}
        position={'absolute'}
      />
      {isLoadingUsers ? (
        <LoadState title="Loading users" loading minH="160px" />
      ) : loadError ? (
        <LoadState
          title="Could not load users"
          description={loadError}
          actionLabel="Retry"
          onAction={loadUsers}
          minH="160px"
        />
      ) : (
        <NativeSelect.Root width={'80vw'}>
          <NativeSelect.Field
            backgroundColor={'black'}
            value={selectUser?.id}
            onChange={onChange}
            placeholder="Select User"
          >
            {users.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.name + ' - ' + user?.username}
                </option>
              );
            })}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      )}
      <HStack>
        <Button
          variant={'surface'}
          colorPalette={!selectUser ? 'red' : undefined}
          disabled={!selectUser || isLoadingUsers || !!loadError}
          onClick={navigateToPlayerScreen}
        >
          Select User
        </Button>
        <Dialog.Root
          placement={'center'}
          motionPreset="slide-in-top"
          size={{ smDown: 'xs', smTo2xl: 'lg' }}
          unmountOnExit={true}
        >
          <Dialog.Trigger asChild>
            <Button variant="surface" p={2}>
              Create User
            </Button>
          </Dialog.Trigger>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title fontWeight="medium">Create User</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <CreateUserForm />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </HStack>
    </Stack>
  );
}
