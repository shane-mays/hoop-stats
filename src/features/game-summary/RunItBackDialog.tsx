import { UseDialogContext } from '@ark-ui/react';
import { Button, Dialog } from '@chakra-ui/react';
import { showToast } from 'components/ui/toaster';
import { GameBoxScoreType } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { createGame } from 'lib/supabaseApi';
import { useState } from 'react';

type RunItBackDialogProps = {
  gameBoxScore: GameBoxScoreType;
  onCreated?: () => void;
};

export default function RunItBackDialog(props: RunItBackDialogProps) {
  const { gameBoxScore, onCreated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tryCreatingGame = async (store: UseDialogContext) => {
    setIsSubmitting(true);
    try {
      const homeTeam =
        gameBoxScore.teams
          .find((team) => team.teamName === 'HOME')
          ?.players.map((p) => p.userId) ?? [];
      const awayTeam =
        gameBoxScore.teams
          .find((team) => team.teamName === 'AWAY')
          ?.players.map((p) => p.userId) ?? [];

      const data = await createGame(
        parseInt(gameBoxScore.targetScore),
        gameBoxScore.scoring,
        gameBoxScore.courtSize,
        gameBoxScore.location,
        'HOME',
        'AWAY',
        homeTeam,
        awayTeam,
      );

      if (data) {
        showToast('Game Created', 'success');
        onCreated?.();
        store.setOpen(false);
      }
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to create game.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog.Root placement={'center'}>
      <Dialog.Trigger asChild>
        <Button variant={'surface'} size={'xs'}>
          Run It Back!
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content m={4}>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Are you sure?</Dialog.Title>
          </Dialog.Header>
          <Dialog.Description>
            This will create a new game with the same lineup and settings
          </Dialog.Description>
          <Dialog.Body></Dialog.Body>
          <Dialog.Context>
            {(store) => (
              <Dialog.Footer>
                <Button
                  onClick={() => tryCreatingGame(store)}
                  loading={isSubmitting}
                  loadingText="Creating Game"
                >
                  Yes, Run It Back!
                </Button>
              </Dialog.Footer>
            )}
          </Dialog.Context>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
