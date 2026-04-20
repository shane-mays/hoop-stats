import {
  Button,
  CloseButton,
  Dialog,
  Field,
  HStack,
  IconButton,
  NumberInput,
  Stack,
  Text,
} from '@chakra-ui/react';
import { showToast } from 'components/ui/toaster';
import { useForm } from 'hooks/useForm';
import { GameBoxScoreType, GameScoringEnum } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import {
  calculatePlayerPoints,
  EMPTY_PLAYER_STAT_VALUES,
  getEditablePlayerContext,
  PlayerStatFormValues,
} from 'lib/playerStats';
import { upsertPlayerStats } from 'lib/supabaseApi';
import { useMemo, useState } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

type StatStepperFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

const StatStepperField = (props: StatStepperFieldProps) => {
  const { label, value, onValueChange } = props;

  return (
    <Field.Root width={'auto'}>
      <Field.Label>{label}</Field.Label>
      <NumberInput.Root
        unstyled
        spinOnPress={false}
        value={value}
        onValueChange={(e) => {
          onValueChange(e.value);
        }}
        min={0}
      >
        <HStack gap="2">
          <NumberInput.DecrementTrigger asChild>
            <IconButton variant="surface" size="sm">
              <LuMinus />
            </IconButton>
          </NumberInput.DecrementTrigger>
          <NumberInput.ValueText textAlign="center" fontSize="lg" minW="3ch" />
          <NumberInput.IncrementTrigger asChild>
            <IconButton variant="surface" size="sm">
              <LuPlus />
            </IconButton>
          </NumberInput.IncrementTrigger>
        </HStack>
      </NumberInput.Root>
      <Field.ErrorText>The entry is invalid</Field.ErrorText>
    </Field.Root>
  );
};

type PlayerStatEditDialogProps = {
  playerId: string;
  gameBoxScore: GameBoxScoreType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
};

export default function PlayerStatEditDialog(props: PlayerStatEditDialogProps) {
  const { playerId, gameBoxScore, open, onOpenChange, onSaved } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id, scoring: scoringType } = gameBoxScore;

  const editablePlayerContext = useMemo(() => {
    return getEditablePlayerContext(gameBoxScore, playerId);
  }, [gameBoxScore, playerId]);

  const form = useForm<PlayerStatFormValues>(
    editablePlayerContext?.initialValues ?? EMPTY_PLAYER_STAT_VALUES,
    {},
  );

  const totalPoints = calculatePlayerPoints(
    form.values,
    scoringType,
  ).toString();

  const updateStat = async () => {
    if (!editablePlayerContext) {
      showToast('Player stats are unavailable for editing.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await upsertPlayerStats(
        id,
        playerId,
        editablePlayerContext.teamId,
        calculatePlayerPoints(form.values, scoringType),
        parseInt(form.values.ones),
        parseInt(form.values.twos),
        parseInt(form.values.threes),
        parseInt(form.values.assists),
        parseInt(form.values.blocks),
        parseInt(form.values.rebounds),
        parseInt(form.values.steals),
      );
      await onSaved();
      showToast('Saved Stats', 'success');
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to save stats.'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root
      placement={'bottom'}
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      unmountOnExit={true}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title p={0}>
              Edit Stats
              {editablePlayerContext
                ? ` - ${editablePlayerContext.player.name}`
                : ''}
            </Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {!editablePlayerContext ? (
              <Stack gap={4}>
                <Text>
                  This player could not be resolved from the current game
                  summary.
                </Text>
                <Button variant="surface" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </Stack>
            ) : (
              <HStack
                gap={4}
                flexWrap={'wrap'}
                flexDirection={'row'}
                justifyContent={'space-between'}
              >
                <Field.Root width={'auto'}>
                  <Field.Label>Total Points</Field.Label>
                  <Text
                    h={'40px'}
                    fontSize="lg"
                    alignContent={'center'}
                    alignSelf={'center'}
                  >
                    {totalPoints}
                  </Text>
                </Field.Root>
                {scoringType == GameScoringEnum.ONES_AND_TWOS && (
                  <StatStepperField
                    label="Ones"
                    value={form.values.ones}
                    onValueChange={(value) => {
                      form.setValue('ones', value);
                    }}
                  />
                )}
                <StatStepperField
                  label="Twos"
                  value={form.values.twos}
                  onValueChange={(value) => {
                    form.setValue('twos', value);
                  }}
                />
                {scoringType == GameScoringEnum.TWOS_AND_THREES && (
                  <StatStepperField
                    label="Threes"
                    value={form.values.threes}
                    onValueChange={(value) => {
                      form.setValue('threes', value);
                    }}
                  />
                )}
                <StatStepperField
                  label="Assists"
                  value={form.values.assists}
                  onValueChange={(value) => {
                    form.setValue('assists', value);
                  }}
                />
                <StatStepperField
                  label="Blocks"
                  value={form.values.blocks}
                  onValueChange={(value) => {
                    form.setValue('blocks', value);
                  }}
                />
                <StatStepperField
                  label="Steals"
                  value={form.values.steals}
                  onValueChange={(value) => {
                    form.setValue('steals', value);
                  }}
                />

                <Button
                  variant={'surface'}
                  loading={isSubmitting}
                  loadingText={'Updating Stats'}
                  onClick={updateStat}
                  w={'100%'}
                >
                  Submit Stats
                </Button>
              </HStack>
            )}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
