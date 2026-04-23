import { TeamCombinationSummary } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { getUserTeamCombinations } from 'lib/supabaseApi';
import { useCallback, useEffect, useState } from 'react';

export default function useTeamHistoryData(userId?: string) {
  const [combinations, setCombinations] = useState<TeamCombinationSummary[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTeamHistory = useCallback(async () => {
    if (!userId) {
      setCombinations([]);
      setLoadError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await getUserTeamCombinations(userId);
      const sortedCombinations = [...response].sort((a, b) => {
        return (
          b.winPct - a.winPct ||
          b.gamesPlayed - a.gamesPlayed ||
          a.players
            .map((player) => player.name)
            .join(',')
            .localeCompare(b.players.map((player) => player.name).join(','))
        );
      });
      setCombinations(sortedCombinations);
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Unable to load team combinations.'));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTeamHistory();
  }, [loadTeamHistory]);

  return {
    combinations,
    isLoading,
    loadError,
    loadTeamHistory,
  };
}
