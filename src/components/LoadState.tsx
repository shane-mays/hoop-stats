import { Button, Center, Spinner, Stack, Text } from '@chakra-ui/react';

type LoadStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
  minH?: string;
};

export default function LoadState(props: LoadStateProps) {
  const {
    title,
    description,
    actionLabel,
    onAction,
    loading,
    minH = '200px',
  } = props;

  return (
    <Center minH={minH} px={2} py={3}>
      <Stack align="center" gap={1} textAlign="center">
        {loading && <Spinner size="lg" />}
        <Text fontWeight="bold">{title}</Text>
        {description && <Text color="fg.muted">{description}</Text>}
        {actionLabel && onAction && (
          <Button variant="surface" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Center>
  );
}
