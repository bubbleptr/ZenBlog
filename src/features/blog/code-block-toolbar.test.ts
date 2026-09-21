import { Window } from 'happy-dom';
import { describe, expect, test } from 'bun:test';
import {
  CODE_BLOCK_WRAP_CLASS,
  extractCodeBlockText,
  mountCodeBlockToolbar,
} from '@/features/blog/code-block-toolbar';

const dom = new Window({ url: 'https://example.com' });

globalThis.window = dom as unknown as Window & typeof globalThis.window;
globalThis.document = dom.document;
globalThis.HTMLElement = dom.HTMLElement;
globalThis.Element = dom.Element;

const labels = {
  wrap: 'Wrap lines',
  unwrap: 'Unwrap lines',
  copy: 'Copy',
  copied: 'Copied',
};

function renderArticle(html: string): HTMLElement {
  document.body.innerHTML = `<article data-blog-article><div class="article-prose">${html}</div></article>`;
  return document.querySelector('[data-blog-article]')!;
}

describe('extractCodeBlockText', () => {
  test('reads the code element and drops a trailing newline', () => {
    document.body.innerHTML = `<pre><code>const x = 1;\n</code></pre>`;
    const pre = document.querySelector('pre')!;

    expect(extractCodeBlockText(pre)).toBe('const x = 1;');
  });
});

describe('mountCodeBlockToolbar', () => {
  test('adds wrap and copy buttons to each code block', () => {
    const scope = renderArticle('<pre class="astro-code"><code>hello</code></pre>');

    mountCodeBlockToolbar(scope, { labels });

    const wrap = scope.querySelector('[data-code-wrap]');
    const copy = scope.querySelector('[data-code-copy]');

    expect(wrap).toBeTruthy();
    expect(copy).toBeTruthy();
    expect(wrap?.getAttribute('aria-label')).toBe('Wrap lines');
    expect(copy?.getAttribute('aria-label')).toBe('Copy');
  });

  test('wrap button toggles line wrapping on the pre', () => {
    const scope = renderArticle('<pre class="astro-code"><code>hello</code></pre>');
    mountCodeBlockToolbar(scope, { labels });

    const pre = scope.querySelector('pre')!;
    const wrap = scope.querySelector<HTMLButtonElement>('[data-code-wrap]')!;

    wrap.click();
    expect(pre.classList.contains(CODE_BLOCK_WRAP_CLASS)).toBe(true);
    expect(wrap.getAttribute('aria-pressed')).toBe('true');
    expect(wrap.getAttribute('aria-label')).toBe('Unwrap lines');

    wrap.click();
    expect(pre.classList.contains(CODE_BLOCK_WRAP_CLASS)).toBe(false);
    expect(wrap.getAttribute('aria-pressed')).toBe('false');
  });

  test('copy button writes the code text', async () => {
    const written: string[] = [];
    const scope = renderArticle('<pre class="astro-code"><code>const x = 1;\n</code></pre>');

    mountCodeBlockToolbar(scope, {
      labels,
      writeText: async (text) => {
        written.push(text);
      },
    });

    scope.querySelector<HTMLButtonElement>('[data-code-copy]')!.click();
    await Promise.resolve();

    expect(written).toEqual(['const x = 1;']);
  });
});
