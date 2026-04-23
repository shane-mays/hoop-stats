export const GameStatusEnum = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;

export type GameStatusEnum =
  (typeof GameStatusEnum)[keyof typeof GameStatusEnum];

export const GameScoringEnum = {
  TWOS_AND_THREES: '2S_3S',
  ONES_AND_TWOS: '1S_2S',
} as const;

export type GameScoringEnum =
  (typeof GameScoringEnum)[keyof typeof GameScoringEnum];

export const CourtSizeEnum = {
  HALF: 'HALF',
  FULL: 'FULL',
} as const;

export type CourtSizeEnum = (typeof CourtSizeEnum)[keyof typeof CourtSizeEnum];

export interface PlayerStatsInterface {
  points: number;
  ones: number;
  twos: number;
  threes: number;
  assists: number;
  blocks: number;
  rebounds: number;
  steals: number;
}

export interface User {
  name: string;
  username: string;
  publicId: string;
  id: string;
}

export type CreateUpdateUser = Omit<User, 'id' | 'publicId'>;
export type UpdateUser = Omit<User, 'id'>;

export interface TeamSummary {
  teamName: string;
  teamPoints: number;
  won: boolean;
  teamId: string;
}

export interface RecentGame {
  courtSize: string;
  createdAt: string;
  gameId: string;
  location: string;
  status: GameStatusEnum;
  targetScore: number;
  teams: TeamSummary[];
  userId: string;
  gamePublicId: string;
  didWin: boolean;
  isMvp: boolean;
  userStats: Omit<PlayerStatsInterface, 'ones' | 'twos' | 'threes'>;
  awayTeam: TeamSummary;
  homeTeam: TeamSummary;
  scoringType: GameScoringEnum;
}

export interface GameBoxScoreType {
  public_id: string;
  id: string;
  scoring: GameScoringEnum;
  status: GameStatusEnum;
  courtSize: CourtSizeEnum;
  location: string;
  targetScore: string;
  createdAt: string;
  completedAt?: string;
  teams: TeamBoxScoreType[];
}

export interface TeamBoxScoreType {
  players: Player[];
  score: number;
  teamId: string;
  teamName: string;
  won: boolean;
}

export interface Player {
  isCaptain: boolean;
  isMvp: boolean;
  name: string;
  stats: PlayerStat;
  userId: string;
  userPublicId: string;
  username: string;
}

export interface PlayerStat {
  assists: number;
  blocks: number;
  ones: number;
  points: number;
  rebounds: number;
  steals: number;
  statId: number | null;
  threes: number;
  twos: number;
  updatedAt: number;
}

export type LeaderboardStat = {
  total: number;
  average: number;
};

export type LeaderboardPlayer = {
  userId: string;
  name: string;
  username: string;
  team: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  stats: Record<LeaderboardStatKey, LeaderboardStat>;
};

export type LeaderboardSeason = {
  seasonLabel: string;
  lastUpdated: string;
  players: LeaderboardPlayer[];
};

export type LeaderboardStatKey =
  | 'points'
  | 'assists'
  | 'steals'
  | 'blocks'
  | 'threes'
  | 'wins';

export type TeammateSummary = {
  userId: string;
  name: string;
  username: string;
  gamesTogether: number;
  winsTogether: number;
  lossesTogether: number;
  winPercentage: number;
};

export type PlayerSeasonStats = {
  seasonId: string;
  seasonLabel: string;
  lastUpdated: string;
  stats: Record<LeaderboardStatKey, LeaderboardStat> & {
    losses: number;
    totalGamesPlayed: number;
    statGamesPlayed: number;
  };
};

export type CalculatedGameMvpResult = {
  gameId: string;
  mvpUserIds: string[];
  message: string;
};

export type TeamCombinationPlayer = {
  id: string;
  name: string;
  username: string;
};

export type TeamCombinationSummary = {
  combinationKey: string;
  players: TeamCombinationPlayer[];
  gamesPlayed: number;
  wins: number;
  losses: number;
  winPct: number;
  pointsForAvg: number;
  pointsAgainstAvg: number;
  pointDiffAvg: number;
  lastPlayedAt: string | null;
};
