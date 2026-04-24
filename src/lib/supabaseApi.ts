import {
  CalculatedGameMvpResult,
  CreateUpdateUser,
  CurrentLeaderboards,
  GameBoxScoreType,
  PlayerSeasonStats,
  RecentGame,
  TeamCombinationSummary,
  TeammateSummary,
  User,
} from 'interfaces';
import { supabase } from 'supabaseClient';

export const createUser = async (user: CreateUpdateUser): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select('id, publicId:public_id, name, username')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getAllUsers = async (): Promise<User[] | undefined> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, publicId:public_id, name, username')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, publicId:public_id, name, username')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    if (error) throw error;
    return undefined;
  }

  return data;
};

export const createGame = async (
  targetScore: number,
  scoring: string,
  courtSize: string,
  location: string,
  team1Name: string,
  team2Name: string,
  team1Ids: string[],
  team2Ids: string[],
) => {
  const { data, error } = await supabase.rpc('create_game_with_teams', {
    p_target_score: targetScore,
    p_scoring: scoring,
    p_court_size: courtSize,
    p_location: location,
    p_team1_name: team1Name,
    p_team2_name: team2Name,
    p_team1_users: team1Ids,
    p_team2_users: team2Ids,
  });
  if (error) {
    throw error;
  }

  return data;
};

export const fetchPlayerStats = async (
  userId: string,
): Promise<RecentGame[]> => {
  const { data, error } = await supabase
    .from('recent_game_summary')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as RecentGame[]) || [];
};

export const fetchUserByPublicId = async (publicId: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, publicId:public_id, name, username')
    .eq('public_id', publicId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const fetchGameSummary = async (
  id: string,
): Promise<GameBoxScoreType> => {
  const { data, error } = await supabase
    .from('game_box_score')
    .select('*')
    .eq('public_id', id)
    .single();
  if (error) {
    throw error;
  }

  return data as GameBoxScoreType;
};

export const upsertPlayerStats = async (
  gameId: string,
  userId: string,
  teamId: string,
  points: number,
  ones: number,
  twos: number,
  threes: number,
  assists: number,
  blocks: number,
  rebounds: number,
  steals: number,
) => {
  const { error } = await supabase.from('player_stats').upsert(
    {
      game_id: gameId,
      user_id: userId,
      team_id: teamId,
      points,
      ones,
      twos,
      threes,
      assists,
      blocks,
      rebounds,
      steals,
    },
    { onConflict: 'game_id,user_id' },
  );
  if (error) {
    throw error;
  }
  return true;
};

export const markGameComplete = async (gameId: string, teamId: string) => {
  const { error } = await supabase.rpc('complete_game', {
    p_game_id: gameId,
    p_winning_team_id: teamId,
  });
  if (error) {
    throw error;
  }
  return true;
};

export const calculateGameMvp = async (
  gameId: string,
): Promise<CalculatedGameMvpResult> => {
  const { data, error } = await supabase.rpc('refresh_game_mvp', {
    p_game_id: gameId,
  });

  if (error) {
    throw error;
  }

  return data as CalculatedGameMvpResult;
};

export const getCurrentLeaderboards =
  async (): Promise<CurrentLeaderboards> => {
    const { data, error } = await supabase.rpc('get_current_leaderboards');

    if (error) {
      throw error;
    }

    return data as CurrentLeaderboards;
  };

export const refreshAllCurrentLeaderboard = async () => {
  const { error } = await supabase.rpc('refresh_all_current_leaderboards');

  if (error) {
    throw error;
  }

  return true;
};

export const getTopTeammates = async (
  userId: string,
): Promise<TeammateSummary[]> => {
  const { data, error } = await supabase.rpc('get_top_teammates', {
    p_user_id: userId,
  });

  if (error) {
    throw error;
  }
  return data || [];
};

export const getUserSeasonStats = async (
  userId: string,
): Promise<PlayerSeasonStats> => {
  const { data, error } = await supabase.rpc(
    'get_player_current_season_stats',
    {
      p_user_id: userId,
    },
  );

  if (error) {
    throw error;
  }
  return data || [];
};

export const getUserTeamCombinations = async (
  userId: string,
): Promise<TeamCombinationSummary[]> => {
  const { data, error } = await supabase.rpc('get_user_team_combinations', {
    p_user_id: userId,
  });

  if (error) {
    throw error;
  }

  return data as TeamCombinationSummary[];
};
