import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '../../../src/lib/errors';

describe('getErrorMessage', () => {
  it('returns the error message with the fallback when a valid message exists', () => {
    expect(getErrorMessage(new Error('Error'), 'Try again')).toBe(
      'Error - Try again',
    );
  });

  it('uses the default fallback when no fallback is provided', () => {
    expect(getErrorMessage({ message: 'Backend failed' })).toBe(
      'Backend failed - Something went wrong. Please try again.',
    );
  });

  it('returns the fallback when error is not an object', () => {
    expect(getErrorMessage('error', 'Custom fallback')).toBe(
      'Custom fallback',
    );
  });

  it('returns the fallback when the message property is not a string', () => {
    expect(
      getErrorMessage({ message: { text: 'error' } }, 'Custom fallback'),
    ).toBe('Custom fallback');
  });

  it('returns the fallback when the message is blank', () => {
    expect(getErrorMessage({ message: '   ' }, 'Custom fallback')).toBe(
      'Custom fallback',
    );
  });

  it('returns the fallback when error is null', () => {
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
  });
});
