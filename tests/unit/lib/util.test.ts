import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatDateAndTimeString,
  formatTimeAgo,
  omitId,
  timeDuration,
} from '../../../src/lib/util';

describe('omitId', () => {
  it('returns a new object without the id property', () => {
    expect(
      omitId({
        id: '123',
        name: 'p1',
        username: 'playerone',
      }),
    ).toEqual({
      name: 'p1',
      username: 'playerone',
    });
  });

  it('returns the original properties when id is not present', () => {
    expect(
      omitId({
        name: 'p1',
        username: 'playerone',
      }),
    ).toEqual({
      name: 'p1',
      username: 'playerone',
    });
  });
});

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-19T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
      { timestamp: '2026-04-19T11:58:00.000Z', expected: '2m ago' },
      { timestamp: '2026-04-19T08:59:00.000Z', expected: '3h ago' },
      { timestamp: '2026-04-19T09:00:00.000Z', expected: '3h ago' },
      { timestamp: '2026-04-19T09:01:00.000Z', expected: '2h ago' },
      { timestamp: '2026-04-16T11:59:00.000Z', expected: '3d ago' },
      { timestamp: '2026-04-16T12:00:00.000Z', expected: '3d ago' },
      { timestamp: '2026-04-16T12:01:00.000Z', expected: '2d ago' },
      { timestamp: '2026-03-01T11:59:00.000Z', expected: '7w ago' },
      { timestamp: '2026-03-01T12:00:00.000Z', expected: '7w ago' },
      { timestamp: '2026-03-01T12:01:00.000Z', expected: '6w ago' },
      { timestamp: '2024-04-19T11:59:00.000Z', expected: '2y ago'},
      { timestamp: '2024-04-19T12:00:00.000Z', expected: '2y ago'},
      { timestamp: '2024-04-19T12:01:00.000Z', expected: '1y ago'},

    ])('returns $expected for $timestamp compared to 2026-04-19T12:00:00', ({ timestamp, expected }) => {
      expect(formatTimeAgo(timestamp)).toBe(expected);
    });
});

describe('formatDateAndTimeString', () => {
  it('formats using the expected date-time template', () => {
    const timestamp = '2026-04-19T12:34:00.000Z';
    const expected = new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const formatted = expected.format(new Date(timestamp)).replace(',', ' //');

    expect(formatDateAndTimeString(timestamp)).toBe(formatted);
  });

  it('input is not a date', () => {
    const timestamp = 'bad string';
    expect(formatDateAndTimeString(timestamp)).toBe('');
  })
});

describe('timeDuration', () => {
  it('returns not finished when there is no completion timestamp', () => {
    expect(timeDuration('2026-04-19T12:00:00.000Z')).toBe('Not Finished');
  });

  it('formats the elapsed minutes and seconds when both timestamps exist', () => {
    expect(
      timeDuration('2026-04-19T12:00:00.000Z', '2026-04-19T12:03:25.000Z'),
    ).toBe('3m 25s');
  });

  it('formats the elapsed minutes and seconds when both timestamps exist', () => {
    expect(
      timeDuration('2026-04-19T12:00:00.000Z', '2026-04-19T12:03:25.000Z'),
    ).toBe('3m 25s');
  });

  it.each([
      { createdTimestamp: '2026-04-19T12:00:00.000Z', completedTimestamp: undefined, expected: 'Not Finished' },
      { createdTimestamp: '2026-04-19T12:00:00.000Z', completedTimestamp: '2026-04-19T12:03:25.000Z', expected: '3m 25s' },
      { createdTimestamp: '2026-04-19T12:00:00.000Z', completedTimestamp: 'Not a time', expected: 'N/A' },
      { createdTimestamp: 'Not a time', completedTimestamp: '2026-04-19T12:03:25.000Z', expected: 'N/A' },
      
    ])('returns $expected for createdTimestamp is $createdTimestamp and completedTimestamp is $completedTimestamp calling timeDuration', ({ createdTimestamp, completedTimestamp, expected }) => {
      expect(timeDuration(createdTimestamp, completedTimestamp)).toBe(expected);
    });
});
