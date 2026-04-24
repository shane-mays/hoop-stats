import { Heading, HStack, Stack, Text } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { TeammateSummary } from 'interfaces';

type TopTeammatesSectionProps = {
  teammates: TeammateSummary[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
};

export default function TopTeammatesSection(props: TopTeammatesSectionProps) {
  const { teammates, isLoading, error, onRetry } = props;

  if (isLoading) {
    return <LoadState title="Loading Top Teammates" loading minH="120px" />;
  }

  if (error) {
    return (
      <LoadState
        title="Could not load Top Teammates"
        description={error}
        actionLabel="Retry"
        onAction={onRetry}
        minH="120px"
      />
    );
  }

  if (teammates.length === 0) {
    return (
      <LoadState
        title="No top teammates yet"
        description="Once enough completed games are logged, teammate results will show up here."
        minH="120px"
      />
    );
  }

  return (
    <Stack gap={1}>
      <Heading px={2} size="md" alignSelf="start">
        Top Teammates
      </Heading>

      <HStack gap={1} flexWrap={'wrap'}>
        {teammates.map((teammate, i) => (
          <HStack
            key={teammate.userId}
            justify="space-between"
            className={'overview-container'}
            flex={1}
            minW={'40%'}
          >
            <HStack minW={0} gap={2}>
              <Text className="substat" minW="16px">
                {i + 1}
              </Text>

              <Text className="label">{teammate.name}</Text>
            </HStack>

            <Text className="stat" flexShrink={0}>
              {(teammate.winPercentage * 100).toFixed(1)}%
            </Text>
          </HStack>
        ))}
      </HStack>
    </Stack>
  );
}
