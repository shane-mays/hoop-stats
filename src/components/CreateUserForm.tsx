import 'css/App.css';

import { Button, Stack } from '@chakra-ui/react';
import { useUser } from 'context/UserContext';
import { useForm } from 'hooks/useForm';
import { getErrorMessage } from 'lib/errors';
import { createUser } from 'lib/supabaseApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormField from './FormField';
import { showToast } from './ui/toaster';

type CreateUserFormType = {
  name: string;
  username: string;
};

export default function CreateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();

  const form = useForm<CreateUserFormType>(
    {
      name: '',
      username: '',
    },
    {
      name: (v) => (!v.trim() ? 'Name Required' : null),
      username: (v) => (!v.trim() ? 'Username Required' : null),
    },
  );

  const sendCreateUser = async (name: string, username: string) => {
    setIsLoading(true);
    try {
      const user = await createUser({
        name: name.trim(),
        username: username.trim(),
      });
      showToast('User Created', 'success');
      setCurrentUser(user);
      navigate(`/player/${user.publicId}`);
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to create user.'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap={4}>
      <FormField
        label="Name"
        field="name"
        form={form}
        placeholder="Enter Name"
        required={true}
      />
      <FormField
        label="Username"
        field="username"
        form={form}
        placeholder="Enter Username"
        required={true}
      />

      <Button
        variant={'surface'}
        loading={isLoading}
        loadingText={'Sending'}
        onClick={() => {
          if (!form.submit()) return;
          sendCreateUser(form.values.name, form.values.username);
        }}
      >
        Create
      </Button>
    </Stack>
  );
}
