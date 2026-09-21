import {
  mountCodeBlockToolbar,
  type CodeBlockToolbarLabels,
} from '@/features/blog/code-block-toolbar';

export const CODE_BLOCK_SCOPE_SELECTOR = '[data-blog-article]';

interface CodeBlockToolbarInitOptions {
  labels: CodeBlockToolbarLabels;
}

let activeCleanup: (() => void) | undefined;

export function initCodeBlockToolbar(options: CodeBlockToolbarInitOptions): void {
  teardownCodeBlockToolbar();

  const scope = document.querySelector(CODE_BLOCK_SCOPE_SELECTOR);
  if (!scope) {
    return;
  }

  const cleanup = mountCodeBlockToolbar(scope, options);
  if (cleanup) {
    activeCleanup = cleanup;
  }
}

export function teardownCodeBlockToolbar(): void {
  activeCleanup?.();
  activeCleanup = undefined;
}
