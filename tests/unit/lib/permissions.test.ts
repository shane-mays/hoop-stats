import { describe, expect, it } from 'vitest';
import {
  canEditPlayerStats,
  isStatsAdmin,
} from '../../../src/lib/permissions';

describe('isStatsAdmin', () => {
  it.each([
    { user: undefined, expected: false },
    {
      user: { id: '1', publicId: 'p1', name: 'Test', username: 'OVO' },
      expected: true,
    },
    {
      user: { id: '2', publicId: 'p2', name: 'Test', username: 'other' },
      expected: false,
    },
  ])('returns $expected for $user?.username', ({ user, expected }) => {
    expect(isStatsAdmin(user)).toBe(expected);
  });
});

describe('canEditPlayerStats', () => {
  it.each([
    {
      user: undefined,
      id: '1',
      expected: false,
      description: 'when there is no current user',
    },
    {
      user: { id: '1', publicId: 'p1', name: 'Test', username: 'OVO' },
      id: '2',
      expected: true,
      description: 'when current user is the statsAdmin',
    },
    {
      user: { id: '2', publicId: 'p2', name: 'Test', username: 'other' },
      id: '2',
      expected: true,
      description: 'when current user is editing their own stats',
    },
    {
      user: { id: '2', publicId: 'p2', name: 'Test', username: 'other' },
      id: '3',
      expected: false,
      description: 'when current user is trying to edit someone elses stats',
    },
  ])('returns $expected for $description', ({ user, id, expected }) => {
    expect(canEditPlayerStats(user, id)).toBe(expected);
  });
});
