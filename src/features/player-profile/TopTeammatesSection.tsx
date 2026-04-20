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
      <Heading px={4} size="md" alignSelf="start">
        Top Teammates
      </Heading>

      <HStack px={1} gap={1} flexWrap={'wrap'}>
        {teammates.map((teammate, i) => (
          <HStack
            key={teammate.userId}
            justify="space-between"
            px={2}
            py={1}
            bg="bg.panel"
            borderRadius=".5rem"
            borderWidth="1px"
            borderColor="border.emphasized"
            flex={1}
          >
            <HStack minW={0} gap={2}>
              <Text color="whiteAlpha.500" fontWeight="bold" minW="16px">
                {i + 1}
              </Text>

              <Text
                fontWeight={'medium'}
                fontSize="sm"
                lineHeight={1.25}
                color={'#D0CFE5'}
              >
                {teammate.name}
              </Text>
            </HStack>

            <Text
              fontSize="md"
              fontWeight={'bold'}
              lineHeight={'1'}
              flexShrink={0}
            >
              {(teammate.winPercentage * 100).toFixed(1)}%
            </Text>
          </HStack>
        ))}
      </HStack>
    </Stack>
  );
}
