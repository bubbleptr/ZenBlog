import { useCallback, useEffect, useRef, useState } from 'react';
import { getActiveTocIndex } from '@/features/blog/toc';
import {
  HookSidebar,
  type HookSidebarItem,
} from '@/shared/components/navigation/HookSidebar.client';

const SCROLL_IDLE_MS = 180;

export interface ArticleHookTocItem {
  id: string;
  label: string;
}

interface ArticleHookTocProps {
  items: ArticleHookTocItem[];
  label: string;
  className?: string;
}

function readHeadingTops(items: ArticleHookTocItem[]): Array<number | null> {
  return items.map((item) => {
    const heading = document.getElementById(item.id);
    if (!heading) {
      return null;
    }

    return heading.getBoundingClientRect().top + window.scrollY;
  });
}

export default function ArticleHookToc({ items, label, className }: ArticleHookTocProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const lockedIndexRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | undefined>(undefined);

  const syncFromScroll = useCallback(() => {
    if (lockedIndexRef.current !== null) {
      setActiveIndex(lockedIndexRef.current);
      return;
    }

    setActiveIndex(getActiveTocIndex(readHeadingTops(items), window.scrollY));
  }, [items]);

  const scheduleUnlock = useCallback(() => {
    window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      lockedIndexRef.current = null;
      setActiveIndex(getActiveTocIndex(readHeadingTops(items), window.scrollY));
    }, SCROLL_IDLE_MS);
  }, [items]);

  useEffect(() => {
    const onScroll = () => {
      if (lockedIndexRef.current !== null) {
        setActiveIndex(lockedIndexRef.current);
        scheduleUnlock();
        return;
      }

      syncFromScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    syncFromScroll();

    const prose = document.querySelector('.article-prose');
    const observer = prose
      ? new ResizeObserver(() => {
          if (lockedIndexRef.current !== null) {
            return;
          }

          syncFromScroll();
        })
      : null;
    if (prose && observer) {
      observer.observe(prose);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimerRef.current);
      observer?.disconnect();
    };
  }, [scheduleUnlock, syncFromScroll]);

  const sidebarItems: HookSidebarItem[] = items.map((item) => ({
    label: item.label,
    href: `#${item.id}`,
  }));

  return (
    <HookSidebar
      className={className}
      label={label}
      items={sidebarItems}
      value={activeIndex}
      onChange={(index) => {
        lockedIndexRef.current = index;
        setActiveIndex(index);
        scheduleUnlock();
      }}
    />
  );
}
