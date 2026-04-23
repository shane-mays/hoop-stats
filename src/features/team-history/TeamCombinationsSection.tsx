import { Heading, Stack } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { TeamCombinationSummary } from 'interfaces';

import TeamCombinationItem from './TeamCombinationItem';

type TeamCombinationsSectionProps = {
  combinations: TeamCombinationSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function TeamCombinationsSection(
  props: TeamCombinationsSectionProps,
) {
  const { combinations, isLoading, error, onRetry } = props;

  if (isLoading) {
    return (
      <LoadState title="Loading lineup combinations" loading minH="240px" />
    );
  }

  if (error) {
    return (
      <LoadState
        title="Could not load lineup combinations"
        description={error}
        actionLabel="Retry"
        onAction={onRetry}
        minH="240px"
      />
    );
  }

  if (combinations.length === 0) {
    return (
      <LoadState
        title="No lineup combinations yet"
        description="Once enough completed games are logged, lineup performance will show up here."
        minH="240px"
      />
    );
  }

  return (
    <Stack gap={1}>
      <Heading size="md" alignSelf="start" px={4}>
        Best Team Combos
      </Heading>

      {combinations.map((combination, index) => (
        <TeamCombinationItem
          key={combination.combinationKey}
          combination={combination}
          rank={index + 1}
        />
      ))}
    </Stack>
  );
}
