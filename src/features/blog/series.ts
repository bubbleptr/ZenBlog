// zh and en posts tag the series in their own language.
export const INDIE_DEV_WEEKLY_TAGS = ['独立开发周报', 'indie-dev-weekly'];

export function isIndieDevWeeklyPost(tags: string[] | undefined): boolean {
  return tags?.some((tag) => INDIE_DEV_WEEKLY_TAGS.includes(tag)) ?? false;
}
