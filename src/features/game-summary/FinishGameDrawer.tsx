import { UseDialogContext } from '@ark-ui/react';
import {
  Button,
  CloseButton,
  Drawer,
  HStack,
  RadioCard,
  Stack,
} from '@chakra-ui/react';
import { showToast } from 'components/ui/toaster';
import { GameBoxScoreType } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { markGameComplete } from 'lib/supabaseApi';
import { useState } from 'react';

type FinishGameDrawerProps = {
  gameBoxScore: GameBoxScoreType;
  refetch: () => Promise<void>;
};

export default function FinishGameDrawer(props: FinishGameDrawerProps) {
  const [teamId, setTeamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { gameBoxScore, refetch } = props;

  const { teams } = gameBoxScore;

  const completeGame = async (store: UseDialogContext) => {
    setIsSubmitting(true);
    try {
      await markGameComplete(gameBoxScore.id, teamId);
      await refetch();
      store.setOpen(false);
      showToast('Marked Game as Complete', 'success');
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to complete game.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer.Root placement={'bottom'} unmountOnExit={true}>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          Finish Game
        </Button>
      </Drawer.Trigger>

      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Complete Game</Drawer.Title>
          </Drawer.Header>
          <Drawer.Context>
            {(store: UseDialogContext) => (
              <Drawer.Body>
                <Stack
                  gap={3}
                  css={{
                    "& [data-scope='field'][data-part='root']": {
                      alignItems: 'center',
                      alignContent: 'center',
                    },
                  }}
                >
                  <RadioCard.Root
                    value={teamId}
                    onValueChange={(e) => {
                      if (e.value) setTeamId(e.value);
                    }}
                  >
                    <RadioCard.Label>Which Team Won</RadioCard.Label>
                    <HStack align="stretch" p={4}>
                      {teams?.map((team) => (
                        <RadioCard.Item value={team.teamId} key={team.teamId}>
                          <RadioCard.ItemHiddenInput />
                          <RadioCard.ItemControl>
                            <RadioCard.ItemText>
                              {team.teamName}
                            </RadioCard.ItemText>
                            <RadioCard.ItemIndicator />
                          </RadioCard.ItemControl>
                        </RadioCard.Item>
                      ))}
                    </HStack>
                  </RadioCard.Root>

                  <Button
                    variant={'surface'}
                    loading={isSubmitting}
                    loadingText={'Finishing Game'}
                    onClick={() => completeGame(store)}
                    disabled={teamId === '' || isSubmitting}
                  >
                    Mark Complete
                  </Button>
                </Stack>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Body>
            )}
          </Drawer.Context>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
