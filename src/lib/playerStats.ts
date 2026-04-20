import { GameBoxScoreType, GameScoringEnum, Player } from 'interfaces';

export type PlayerStatFormValues = {
  points: string;
  ones: string;
  twos: string;
  threes: string;
  assists: string;
  blocks: string;
  rebounds: string;
  steals: string;
};

type EditablePlayerContext = {
  availablePlayers: Player[];
  initialValues: PlayerStatFormValues;
  player: Player;
  teamId: string;
};

export const EMPTY_PLAYER_STAT_VALUES: PlayerStatFormValues = {
  points: '0',
  ones: '0',
  twos: '0',
  threes: '0',
  assists: '0',
  blocks: '0',
  rebounds: '0',
  steals: '0',
};

export const getEditablePlayerContext = (
  gameBoxScore: GameBoxScoreType,
  playerId: string,
): EditablePlayerContext | null => {
  const availablePlayers = gameBoxScore.teams.flatMap((team) => team.players);

  for (const team of gameBoxScore.teams) {
    const player = team.players.find(
      (teamPlayer) => teamPlayer.userId === playerId,
    );
    if (!player) continue;

    return {
      availablePlayers,
      initialValues: {
        points: player.stats.points.toString(),
        ones: player.stats.ones.toString(),
        twos: player.stats.twos.toString(),
        threes: player.stats.threes.toString(),
        assists: player.stats.assists.toString(),
        blocks: player.stats.blocks.toString(),
        rebounds: player.stats.rebounds.toString(),
        steals: player.stats.steals.toString(),
      },
      player,
      teamId: team.teamId,
    };
  }

  return null;
};

export const calculatePlayerPoints = (
  values: Pick<PlayerStatFormValues, 'ones' | 'twos' | 'threes'>,
  scoringType: GameScoringEnum,
) => {
  const ones = parseInt(values.ones) || 0;
  const twos = parseInt(values.twos) || 0;
  const threes = parseInt(values.threes) || 0;

  if (scoringType === GameScoringEnum.ONES_AND_TWOS) {
    return ones + twos * 2;
  }

  return twos * 2 + threes * 3;
};
