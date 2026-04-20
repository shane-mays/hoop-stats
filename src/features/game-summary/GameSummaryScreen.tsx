import { Box, Button, HStack } from '@chakra-ui/react';
import LoadState from 'components/LoadState';
import { showToast } from 'components/ui/toaster';
import { useUser } from 'context/UserContext';
import { GameBoxScoreType, GameStatusEnum } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { canEditPlayerStats, isStatsAdmin } from 'lib/permissions';
import { calculateGameMvp, fetchGameSummary } from 'lib/supabaseApi';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoMdCalculator } from 'react-icons/io';
import { useParams } from 'react-router-dom';

import FinishGameDrawer from './FinishGameDrawer';
import GameBoxScore from './GameBoxScore';
import GameSummaryHeader from './GameSummaryHeader';
import PlayerStatEditDialog from './PlayerStatEditDialog';

type GameSummaryProps = {
  publicId?: string | undefined;
  onGameUpdated?: () => void;
};

const applyCalculatedMvp = (
  gameBoxScore: GameBoxScoreType,
  mvpUserIds: string[],
): GameBoxScoreType => {
  const nextMvpUserIds = new Set(mvpUserIds);

  return {
    ...gameBoxScore,
    teams: gameBoxScore.teams.map((team) => ({
      ...team,
      players: team.players.map((player) => ({
        ...player,
        isMvp: nextMvpUserIds.has(player.userId),
      })),
    })),
  };
};

export default function GameSummaryScreen(props: GameSummaryProps) {
  const { gameId } = useParams();
  const { onGameUpdated } = props;
  const publicId = gameId || props.publicId;
  const { selectedUser } = useUser();
  const [openEditStats, setOpenEditStats] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [gameBoxScore, setGameBoxScore] = useState<GameBoxScoreType | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCalculatingMvp, setIsCalculatingMvp] = useState(false);
  const hasPendingParentRefresh = useRef(false);

  const fetchGame = useCallback(async () => {
    if (!publicId) {
      setGameBoxScore(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchGameSummary(publicId);
      setGameBoxScore(data);
    } catch (error) {
      setGameBoxScore(null);
      setLoadError(getErrorMessage(error, 'Unable to load game summary.'));
    } finally {
      setIsLoading(false);
    }
  }, [publicId]);

  const markSessionUpdated = useCallback(() => {
    hasPendingParentRefresh.current = true;
  }, []);

  const closeEditDrawer = async () => {
    markSessionUpdated();
    setOpenEditStats(false);
    setEditingPlayerId(null);
    await fetchGame();
  };

  const handleEditPlayer = useCallback((playerId: string) => {
    setEditingPlayerId(playerId);
    setOpenEditStats(true);
  }, []);

  const handleEditOpenChange = useCallback((open: boolean) => {
    setOpenEditStats(open);
    if (!open) {
      setEditingPlayerId(null);
    }
  }, []);

  const canEditPlayer = useCallback(
    (playerId: string) => canEditPlayerStats(selectedUser, playerId),
    [selectedUser],
  );

  const handleCalculateMvp = useCallback(async () => {
    if (!gameBoxScore) {
      return;
    }

    setIsCalculatingMvp(true);
    try {
      const result = await calculateGameMvp(gameBoxScore.id);

      setGameBoxScore((currentGameBoxScore) => {
        if (!currentGameBoxScore) {
          return currentGameBoxScore;
        }

        return applyCalculatedMvp(currentGameBoxScore, result.mvpUserIds);
      });

      markSessionUpdated();
      showToast('Calculated MVP results', 'success');
    } catch (error) {
      showToast(getErrorMessage(error, 'Unable to calculate MVP.'), 'error');
    } finally {
      setIsCalculatingMvp(false);
    }
  }, [gameBoxScore, markSessionUpdated]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  useEffect(() => {
    return () => {
      if (hasPendingParentRefresh.current) {
        onGameUpdated?.();
        hasPendingParentRefresh.current = false;
      }
    };
  }, [onGameUpdated]);

  if (isLoading) {
    return <LoadState title="Loading game summary" loading minH={'400px'} />;
  }

  if (loadError) {
    return (
      <LoadState
        title="Could not load game summary"
        description={loadError}
        actionLabel="Retry"
        onAction={fetchGame}
      />
    );
  }

  if (!gameBoxScore) {
    return (
      <LoadState
        title="Game not found"
        description="The requested game summary is unavailable."
      />
    );
  }

  return (
    <Box px={1} py={4} gap={4}>
      <GameSummaryHeader
        onReload={fetchGame}
        onRunItBack={markSessionUpdated}
        publicId={props.publicId}
        gameBoxScore={gameBoxScore}
      />
      <GameBoxScore
        gameBoxScore={gameBoxScore}
        canEditPlayer={canEditPlayer}
        onEditPlayer={handleEditPlayer}
      />
      {editingPlayerId && (
        <PlayerStatEditDialog
          playerId={editingPlayerId}
          gameBoxScore={gameBoxScore}
          open={openEditStats}
          onOpenChange={handleEditOpenChange}
          onSaved={closeEditDrawer}
        />
      )}
      <HStack mt={4}>
        {gameBoxScore.status === GameStatusEnum.PENDING && (
          <FinishGameDrawer gameBoxScore={gameBoxScore} refetch={fetchGame} />
        )}
        {gameBoxScore.status === GameStatusEnum.COMPLETED &&
          isStatsAdmin(selectedUser) && (
            <Button
              variant="outline"
              size="sm"
              loading={isCalculatingMvp}
              loadingText="Calculating MVP"
              onClick={handleCalculateMvp}
            >
              <IoMdCalculator />
              Calculate MVP
            </Button>
          )}
      </HStack>
    </Box>
  );
}
