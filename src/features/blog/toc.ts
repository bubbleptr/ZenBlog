export interface TocHeading {
  slug: string;
  text: string;
  depth: 2 | 3;
}

export const MIN_TOC_HEADINGS = 2;

/** Matches `.prose h2` `scroll-margin-top: 6rem`. */
export const TOC_HEADER_OFFSET = 96;

export function getActiveTocIndex(
  headingTops: Array<number | null>,
  scrollY: number,
  headerOffset = TOC_HEADER_OFFSET,
): number {
  // Scroll-into-view parks the heading a fraction of a pixel below the
  // scroll-margin line, so a 1px slop keeps that section selected.
  const anchor = scrollY + headerOffset + 1;
  let activeIndex = 0;

  for (let index = 0; index < headingTops.length; index += 1) {
    const top = headingTops[index];
    if (top !== null && anchor >= top) {
      activeIndex = index;
    }
  }

  return activeIndex;
}

export function getArticleTocHeadings(headings: TocHeading[]): TocHeading[] {
  return headings.filter((heading) => heading.depth === 2);
}

export function shouldShowToc(headings: TocHeading[]): boolean {
  return headings.length >= MIN_TOC_HEADINGS;
}
