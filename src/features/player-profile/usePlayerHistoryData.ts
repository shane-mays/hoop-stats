import { PlayerSeasonStats, RecentGame, TeammateSummary } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import {
  fetchPlayerStats,
  getTopTeammates,
  getUserSeasonStats,
} from 'lib/supabaseApi';
import { useCallback, useEffect, useState } from 'react';

export default function usePlayerHistoryData(pageUserId?: string) {
  const [seasonStats, setSeasonStats] = useState<PlayerSeasonStats | null>(
    null,
  );
  const [isLoadingSeasonStats, setIsLoadingSeasonStats] = useState(true);
  const [seasonStatsLoadError, setSeasonStatsLoadError] = useState<
    string | null
  >(null);

  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [gamesLoadError, setGamesLoadError] = useState<string | null>(null);

  const [topTeammates, setTopTeammates] = useState<TeammateSummary[]>([]);
  const [isLoadingTeammates, setIsLoadingTeammates] = useState(true);
  const [teammatesLoadError, setTeammatesLoadError] = useState<string | null>(
    null,
  );

  const loadPlayerSeasonStats = useCallback(async () => {
    setIsLoadingSeasonStats(true);
    setSeasonStatsLoadError(null);
    if (!pageUserId) {
      setSeasonStats(null);
      setIsLoadingSeasonStats(false);
      return;
    }
    try {
      const data = await getUserSeasonStats(pageUserId);
      setSeasonStats(data);
    } catch (error) {
      setSeasonStatsLoadError(
        getErrorMessage(error, 'Unable to load player history.'),
      );
    } finally {
      setIsLoadingSeasonStats(false);
    }
  }, [pageUserId]);

  const loadPlayerHistory = useCallback(async () => {
    setIsLoadingGames(true);
    setGamesLoadError(null);

    if (!pageUserId) {
      setRecentGames([]);
      setIsLoadingGames(false);
      return;
    }

    try {
      const data = await fetchPlayerStats(pageUserId);
      setRecentGames(data);
    } catch (error) {
      setGamesLoadError(
        getErrorMessage(error, 'Unable to load player history.'),
      );
    } finally {
      setIsLoadingGames(false);
    }
  }, [pageUserId]);

  const loadTopTeammates = useCallback(async () => {
    setIsLoadingTeammates(true);
    setTeammatesLoadError(null);

    if (!pageUserId) {
      setTopTeammates([]);
      setIsLoadingTeammates(false);
      return;
    }

    try {
      const data = await getTopTeammates(pageUserId);
      setTopTeammates(data);
    } catch (error) {
      setTeammatesLoadError(
        getErrorMessage(error, 'Unable to load top teammates.'),
      );
    } finally {
      setIsLoadingTeammates(false);
    }
  }, [pageUserId]);

  const refresh = useCallback(() => {
    void loadPlayerHistory();
    void loadTopTeammates();
    void loadPlayerSeasonStats();
  }, [loadPlayerHistory, loadTopTeammates, loadPlayerSeasonStats]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    seasonStats,
    isLoadingSeasonStats,
    seasonStatsLoadError,
    loadPlayerSeasonStats,
    recentGames,
    isLoadingGames,
    gamesLoadError,
    loadPlayerHistory,
    topTeammates,
    isLoadingTeammates,
    teammatesLoadError,
    loadTopTeammates,
    refresh,
  };
}
