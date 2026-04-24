import {
  Button,
  Field,
  Heading,
  HStack,
  IconButton,
  NumberInput,
  RadioCard,
  Stack,
} from '@chakra-ui/react';
import FormField from 'components/FormField';
import LoadState from 'components/LoadState';
import { showToast } from 'components/ui/toaster';
import { useForm } from 'hooks/useForm';
import { CourtSizeEnum, User } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { createGame, getAllUsers } from 'lib/supabaseApi';
import { useCallback, useEffect, useState } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { EditTeamComponent } from './EditTeamComponent';
import useTeam from './useTeam';

type CreateGameFormType = {
  targetScore: string;
  scoringType: string;
  courtSize: string;
  location: string;
};

export default function CreateGameScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const team1 = useTeam(users);
  const team2 = useTeam(users);
  const navigate = useNavigate();

  const selectedPlayers: User[] = team1.team.concat(team2.team);

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setLoadError(null);
    try {
      const data = await getAllUsers();
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Unable to load players.'));
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const form = useForm<CreateGameFormType>(
    {
      targetScore: '15',
      scoringType: '2S_3S',
      courtSize: CourtSizeEnum.HALF,
      location: 'Ravensway',
    },
    {},
  );

  const tryCreatingGame = async () => {
    setIsSubmitting(true);
    try {
      const data = await createGame(
        parseInt(form.values.targetScore),
        form.values.scoringType,
        form.values.courtSize,
        form.values.location,
        'HOME',
        'AWAY',
        team1.team.map((p) => p.id),
        team2.team.map((p) => p.id),
      );
      if (data) {
        showToast('Game Created', 'success');
        navigate('/player');
      }
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to create game.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack className="screen-container">
      {isLoadingUsers ? (
        <LoadState title="Loading players" loading />
      ) : loadError ? (
        <LoadState
          title="Could not load players"
          description={loadError}
          actionLabel="Retry"
          onAction={loadUsers}
        />
      ) : (
        <>
          <Heading px={2} size="lg">
            Create Game
          </Heading>
          <Stack gap={4} px={2}>
            <HStack>
              <Field.Root>
                <Field.Label>Total Points to Win</Field.Label>
                <NumberInput.Root
                  spinOnPress={false}
                  value={form.values.targetScore}
                  onValueChange={(e) => {
                    form.setValue('targetScore', e.value);
                  }}
                >
                  <HStack gap="2">
                    <NumberInput.DecrementTrigger asChild>
                      <IconButton variant="surface" size="sm">
                        <LuMinus />
                      </IconButton>
                    </NumberInput.DecrementTrigger>
                    <NumberInput.ValueText
                      textAlign="center"
                      fontSize="lg"
                      minW="3ch"
                    />
                    <NumberInput.IncrementTrigger asChild>
                      <IconButton variant="surface" size="sm">
                        <LuPlus />
                      </IconButton>
                    </NumberInput.IncrementTrigger>
                  </HStack>
                </NumberInput.Root>
              </Field.Root>
              <FormField
                label="Location"
                field="location"
                form={form}
                placeholder="Enter where your playing"
              ></FormField>
            </HStack>
            <RadioCard.Root
              value={form.values.courtSize}
              onValueChange={(e) => {
                if (e.value) form.setValue('courtSize', e.value);
              }}
            >
              <RadioCard.Label>Select Court Size</RadioCard.Label>
              <HStack align="stretch">
                <RadioCard.Item value={CourtSizeEnum.HALF}>
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemText>{'Half Court'}</RadioCard.ItemText>
                    <RadioCard.ItemIndicator />
                  </RadioCard.ItemControl>
                </RadioCard.Item>
                <RadioCard.Item value={CourtSizeEnum.FULL}>
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemText>{'Full Court'}</RadioCard.ItemText>
                    <RadioCard.ItemIndicator />
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              </HStack>
            </RadioCard.Root>
            <RadioCard.Root
              value={form.values.scoringType}
              onValueChange={(e) => {
                if (e.value) form.setValue('scoringType', e.value);
              }}
            >
              <RadioCard.Label>Select framework</RadioCard.Label>
              <HStack align="stretch">
                <RadioCard.Item value={'1S_2S'}>
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemText>{'1s and 2s'}</RadioCard.ItemText>
                    <RadioCard.ItemIndicator />
                  </RadioCard.ItemControl>
                </RadioCard.Item>
                <RadioCard.Item value={'2S_3S'}>
                  <RadioCard.ItemHiddenInput />
                  <RadioCard.ItemControl>
                    <RadioCard.ItemText>{'2s and 3s'}</RadioCard.ItemText>
                    <RadioCard.ItemIndicator />
                  </RadioCard.ItemControl>
                </RadioCard.Item>
              </HStack>
            </RadioCard.Root>
          </Stack>
          <div>
            <HStack
              align={'stretch'}
              alignItems={'center'}
              justifyContent={'center'}
              justifyItems={'center'}
            >
              <EditTeamComponent
                teamName="Home"
                team={team1}
                users={users}
                selectedPlayers={selectedPlayers}
              />
              <EditTeamComponent
                teamName="Away"
                team={team2}
                users={users}
                selectedPlayers={selectedPlayers}
              />
            </HStack>
          </div>
          <Button
            variant={'surface'}
            loading={isSubmitting}
            loadingText={'Sending'}
            onClick={tryCreatingGame}
            disabled={
              team1.team.length == 0 || team2.team.length == 0 || isSubmitting
            }
          >
            Create Game
          </Button>
        </>
      )}
    </Stack>
  );
}
