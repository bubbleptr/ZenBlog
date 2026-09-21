import { describe, expect, test } from 'bun:test';
import { extractMarkdownHeadings } from '../../remark/extract-markdown-headings.mjs';
import { shouldShowToc, getArticleTocHeadings, getActiveTocIndex } from '@/features/blog/toc';

describe('extractMarkdownHeadings', () => {
  test('extracts h2 and h3 with anchor-compatible slugs', () => {
    const markdown = `
## 1. 确定选题
Some text
### 4.1 如何使用 YouMind 迭代一个想要的公众号改写 prompt
#### 4.1.1 收集顶流的爆款文章
## 2. 生成调查报告
`;

    expect(extractMarkdownHeadings(markdown)).toEqual([
      {
        slug: 'choose-your-topic',
        text: '1. 确定选题',
        depth: 2,
      },
      {
        slug: 'use-youmind-iterate-wechat-rewriting-prompt',
        text: '4.1 如何使用 YouMind 迭代一个想要的公众号改写 prompt',
        depth: 3,
      },
      {
        slug: 'generate-research-report',
        text: '2. 生成调查报告',
        depth: 2,
      },
    ]);
  });
});

describe('shouldShowToc', () => {
  test('requires at least two headings', () => {
    expect(shouldShowToc([{ slug: 'a', text: 'A', depth: 2 }])).toBe(false);
    expect(
      shouldShowToc([
        { slug: 'a', text: 'A', depth: 2 },
        { slug: 'b', text: 'B', depth: 2 },
      ]),
    ).toBe(true);
  });
});

describe('getActiveTocIndex', () => {
  const tops = [1000, 2000, 4000];

  test('stays on the first heading until the scroll anchor reaches it', () => {
    expect(getActiveTocIndex(tops, 0, 96)).toBe(0);
    expect(getActiveTocIndex(tops, 903, 96)).toBe(0);
  });

  test('advances to the last heading the anchor has reached', () => {
    expect(getActiveTocIndex(tops, 1904, 96)).toBe(1);
    expect(getActiveTocIndex(tops, 3904, 96)).toBe(2);
  });

  test('treats a heading a fraction below the anchor as reached', () => {
    expect(getActiveTocIndex([1000, 2000.2], 1904, 96)).toBe(1);
  });

  test('skips headings that are not in the document', () => {
    expect(getActiveTocIndex([null, 2000, null], 2000, 96)).toBe(1);
  });
});

describe('getArticleTocHeadings', () => {
  test('includes only h2 headings', () => {
    expect(
      getArticleTocHeadings([
        { slug: 'section-one', text: 'Section One', depth: 2 },
        { slug: 'nested-detail', text: 'Nested detail', depth: 3 },
        { slug: 'section-two', text: 'Section Two', depth: 2 },
      ]),
    ).toEqual([
      { slug: 'section-one', text: 'Section One', depth: 2 },
      { slug: 'section-two', text: 'Section Two', depth: 2 },
    ]);
  });
});
