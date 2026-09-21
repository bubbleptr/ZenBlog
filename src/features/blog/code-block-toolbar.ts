export const CODE_BLOCK_WRAP_CLASS = 'is-wrapped';
export const CODE_BLOCK_TOOLBAR_ATTR = 'data-code-toolbar';

export interface CodeBlockToolbarLabels {
  wrap: string;
  unwrap: string;
  copy: string;
  copied: string;
}

export interface CodeBlockToolbarOptions {
  labels: CodeBlockToolbarLabels;
  writeText?: (text: string) => Promise<void>;
}

export function extractCodeBlockText(pre: Element): string {
  const code = pre.querySelector('code');
  const text = code?.textContent ?? pre.textContent ?? '';
  return text.replace(/\n$/, '');
}

export function collectCodeBlocks(scope: ParentNode): HTMLPreElement[] {
  return Array.from(scope.querySelectorAll<HTMLPreElement>('.article-prose pre'));
}

async function defaultWriteText(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some browsers deny clipboard.writeText outside a trusted user gesture.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Clipboard is not available');
  }
}

function createIcon(paths: string): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '15');
  svg.setAttribute('height', '15');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = paths;
  return svg;
}

function wrapIcon(): SVGSVGElement {
  return createIcon(
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h10a3 3 0 0 1 0 6H8m0 0 3-3M8 18l3 3" />',
  );
}

function copyIcon(): SVGSVGElement {
  return createIcon(
    '<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2" /><path fill="none" stroke="currentColor" stroke-width="2" d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />',
  );
}

function checkIcon(): SVGSVGElement {
  return createIcon(
    '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12l5 5L20 7" />',
  );
}

function setButtonIcon(button: HTMLButtonElement, icon: SVGSVGElement): void {
  button.replaceChildren(icon);
}

function createButton(action: string, label: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'code-block-toolbar-button';
  button.setAttribute(action, '');
  button.setAttribute('aria-label', label);
  return button;
}

function enhanceCodeBlock(pre: HTMLPreElement, options: CodeBlockToolbarOptions): void {
  if (pre.hasAttribute(CODE_BLOCK_TOOLBAR_ATTR)) {
    return;
  }

  pre.setAttribute(CODE_BLOCK_TOOLBAR_ATTR, '');

  const toolbar = document.createElement('div');
  toolbar.className = 'code-block-toolbar';

  const wrapButton = createButton('data-code-wrap', options.labels.wrap);
  wrapButton.setAttribute('aria-pressed', 'false');
  setButtonIcon(wrapButton, wrapIcon());

  const copyButton = createButton('data-code-copy', options.labels.copy);
  setButtonIcon(copyButton, copyIcon());

  toolbar.append(wrapButton, copyButton);
  pre.prepend(toolbar);
}

export function mountCodeBlockToolbar(
  scope: ParentNode,
  options: CodeBlockToolbarOptions,
): (() => void) | undefined {
  const blocks = collectCodeBlocks(scope);
  if (blocks.length === 0) {
    return undefined;
  }

  for (const pre of blocks) {
    enhanceCodeBlock(pre, options);
  }

  const writeText = options.writeText ?? defaultWriteText;
  const controller = new AbortController();
  let copiedReset: number | undefined;

  const onClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const wrapButton = target.closest<HTMLButtonElement>('[data-code-wrap]');
    if (wrapButton) {
      const pre = wrapButton.closest('pre');
      if (!pre) {
        return;
      }

      const wrapped = pre.classList.toggle(CODE_BLOCK_WRAP_CLASS);
      wrapButton.setAttribute('aria-pressed', wrapped ? 'true' : 'false');
      wrapButton.setAttribute('aria-label', wrapped ? options.labels.unwrap : options.labels.wrap);
      return;
    }

    const copyButton = target.closest<HTMLButtonElement>('[data-code-copy]');
    if (!copyButton) {
      return;
    }

    const pre = copyButton.closest('pre');
    if (!pre) {
      return;
    }

    void writeText(extractCodeBlockText(pre))
      .then(() => {
        copyButton.setAttribute('aria-label', options.labels.copied);
        setButtonIcon(copyButton, checkIcon());

        window.clearTimeout(copiedReset);
        copiedReset = window.setTimeout(() => {
          copyButton.setAttribute('aria-label', options.labels.copy);
          setButtonIcon(copyButton, copyIcon());
        }, 1600);
      })
      .catch(() => undefined);
  };

  const root = scope instanceof Element ? scope : document;
  root.addEventListener('click', onClick, { signal: controller.signal });

  return () => {
    controller.abort();
    window.clearTimeout(copiedReset);

    for (const pre of collectCodeBlocks(scope)) {
      pre.removeAttribute(CODE_BLOCK_TOOLBAR_ATTR);
      pre.classList.remove(CODE_BLOCK_WRAP_CLASS);
      pre.querySelector('.code-block-toolbar')?.remove();
    }
  };
}
