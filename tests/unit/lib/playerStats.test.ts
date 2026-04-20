import { describe, expect, it } from 'vitest';
import {
  CourtSizeEnum,
  GameBoxScoreType,
  GameScoringEnum,
  GameStatusEnum,
  Player,
} from '../../../src/interfaces';
import {
  calculatePlayerPoints,
  EMPTY_PLAYER_STAT_VALUES,
  getEditablePlayerContext,
} from '../../../src/lib/playerStats';

const makePlayer = (overrides: Partial<Player> = {}): Player => ({
  isCaptain: false,
  isMvp: false,
  name: 'Player One',
  stats: {
    assists: 4,
    blocks: 2,
    ones: 1,
    points: 11,
    rebounds: 7,
    steals: 3,
    statId: 123,
    threes: 1,
    twos: 3,
    updatedAt: 999,
  },
  userId: 'player-1',
  userPublicId: 'player-public-1',
  username: 'playerone',
  ...overrides,
});

const makeGameBoxScore = (players: [Player, Player]): GameBoxScoreType => {
  return {
    public_id: 'game-public-1',
    id: 'game-1',
    scoring: GameScoringEnum.TWOS_AND_THREES,
    status: GameStatusEnum.COMPLETED,
    courtSize: CourtSizeEnum.HALF,
    location: 'Ravensway',
    targetScore: '15',
    createdAt: '2026-04-19T00:00:00.000Z',
    completedAt: '2026-04-19T01:00:00.000Z',
    teams: [
      {
        players: [players[0]],
        score: 15,
        teamId: 'team-1',
        teamName: 'HOME',
        won: true,
      },
      {
        players: players.slice(1),
        score: 12,
        teamId: 'team-2',
        teamName: 'AWAY',
        won: false,
      },
    ],
  };
};

describe('EMPTY_PLAYER_STAT_VALUES', () => {
  it('starts all stat values at zero strings', () => {
    expect(EMPTY_PLAYER_STAT_VALUES).toEqual({
      points: '0',
      ones: '0',
      twos: '0',
      threes: '0',
      assists: '0',
      blocks: '0',
      rebounds: '0',
      steals: '0',
    });
  });
});

describe('getEditablePlayerContext', () => {
  it('returns the editable player context when the home player is found', () => {
    const homePlayer = makePlayer();
    const awayPlayer = makePlayer({
      userId: 'player-2',
      userPublicId: 'player-public-2',
      username: 'playertwo',
      name: 'Player Two',
    });
    const gameBoxScore = makeGameBoxScore([homePlayer, awayPlayer]);

    const context = getEditablePlayerContext(gameBoxScore, 'player-1');

    expect(context).not.toBeNull();
    expect(context?.teamId).toBe('team-1');
    expect(context?.player).toBe(homePlayer);
    expect(context?.availablePlayers).toEqual([homePlayer, awayPlayer]);
    expect(context?.initialValues).toEqual({
      points: '11',
      ones: '1',
      twos: '3',
      threes: '1',
      assists: '4',
      blocks: '2',
      rebounds: '7',
      steals: '3',
    });
  });

  it('returns the editable player context when the away player is found', () => {
    const homePlayer = makePlayer();
    const awayPlayer = makePlayer({
      userId: 'player-2',
      userPublicId: 'player-public-2',
      username: 'playertwo',
      name: 'Player Two',
    });
    const gameBoxScore = makeGameBoxScore([homePlayer, awayPlayer]);

    const context = getEditablePlayerContext(gameBoxScore, 'player-2');

    expect(context).not.toBeNull();
    expect(context?.teamId).toBe('team-2');
    expect(context?.player).toBe(awayPlayer);
    expect(context?.availablePlayers).toEqual([homePlayer, awayPlayer]);
    expect(context?.initialValues).toEqual({
      points: '11',
      ones: '1',
      twos: '3',
      threes: '1',
      assists: '4',
      blocks: '2',
      rebounds: '7',
      steals: '3',
    });
  });

  it('returns null when the player does not exist in the game summary', () => {
    const gameBoxScore = makeGameBoxScore([
      makePlayer(),
      makePlayer({
        userId: 'player-2',
        userPublicId: 'player-public-2',
        username: 'playertwo',
      }),
    ]);

    expect(
      getEditablePlayerContext(gameBoxScore, 'does-not-exist-id'),
    ).toBeNull();
  });
});

describe('calculatePlayerPoints', () => {
  it('calculates points correctly for ones and twos scoring', () => {
    expect(
      calculatePlayerPoints(
        {
          ones: '5',
          twos: '3',
          threes: '9',
        },
        GameScoringEnum.ONES_AND_TWOS,
      ),
    ).toBe(11);
  });

  it('calculates points correctly for twos and threes scoring', () => {
    expect(
      calculatePlayerPoints(
        {
          ones: '5',
          twos: '3',
          threes: '2',
        },
        GameScoringEnum.TWOS_AND_THREES,
      ),
    ).toBe(12);
  });

  it('treats invalid numeric values as zero', () => {
    expect(
      calculatePlayerPoints(
        {
          ones: 'not-a-number',
          twos: '',
          threes: 'nope',
        },
        GameScoringEnum.TWOS_AND_THREES,
      ),
    ).toBe(0);
  });
});
