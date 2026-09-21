import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'bun:test';

describe('ArticleToc Astro integration', () => {
  test('passes the article toc class through the React className prop', () => {
    const source = readFileSync(new URL('./ArticleToc.astro', import.meta.url), 'utf8');

    expect(source).toContain('className="article-toc"');
  });

  test('renders the hook sidebar and leaves CrispToc off the article page', () => {
    const source = readFileSync(new URL('./ArticleToc.astro', import.meta.url), 'utf8');

    expect(source).toContain('ArticleHookToc');
    expect(source).not.toContain('CrispToc');
  });
});
