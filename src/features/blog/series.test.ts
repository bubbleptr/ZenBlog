import { describe, expect, test } from 'bun:test';
import { isIndieDevWeeklyPost } from '@/features/blog/series';

describe('isIndieDevWeeklyPost', () => {
  test('recognises the weekly in both languages', () => {
    expect(isIndieDevWeeklyPost(['独立开发周报'])).toBe(true);
    expect(isIndieDevWeeklyPost(['indie-dev-weekly'])).toBe(true);
  });

  test('ignores other posts', () => {
    expect(isIndieDevWeeklyPost(['tutorial'])).toBe(false);
    expect(isIndieDevWeeklyPost(undefined)).toBe(false);
  });
});
