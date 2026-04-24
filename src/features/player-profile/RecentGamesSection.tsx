import { Heading, Stack } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import RecentGameItem from 'features/player-profile/RecentGameItem';
import { RecentGame } from 'interfaces';

type RecentGamesSectionProps = {
  games: RecentGame[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onOpenGame: (publicId: string) => void;
};

export default function RecentGamesSection(props: RecentGamesSectionProps) {
  const { games, isLoading, error, onRetry, onOpenGame } = props;

  if (isLoading) {
    return <LoadState title="Loading games" loading minH="240px" />;
  }

  if (error) {
    return (
      <LoadState
        title="Could not load games"
        description={error}
        actionLabel="Retry"
        onAction={onRetry}
        minH="240px"
      />
    );
  }

  if (games.length === 0) {
    return (
      <LoadState
        title="No games yet"
        description="Once this player has logged games, they will show up here."
        minH="240px"
      />
    );
  }

  return (
    <Stack gap={1}>
      <Heading size="md" alignSelf="start" px={2}>
        Games
      </Heading>

      {games.map((game) => (
        <RecentGameItem
          gameSummary={game}
          key={game.gameId}
          openDrawer={onOpenGame}
        />
      ))}
    </Stack>
  );
}
