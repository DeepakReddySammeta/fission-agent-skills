---
name: fl-ds-infinite-scroll
description: Use when adding or editing a feed/list that loads more items as the user scrolls, instead of paged controls. Native IntersectionObserver, not a library — Fission's registry has no infinite-scroll component to install.
---

# Fission Infinite Scroll

## Step 0 — this is behavior, not a themed component

Checked against the live registry index
(`https://FissionHQ.github.io/ui-design-system/registry.json`, 2026-11-02):
19 items, all visual primitives/charts — none are scroll behavior. There's
nothing to install here. This needs only the browser's native
`IntersectionObserver`, no new dependency. Whatever renders each row stays
whichever Fission primitive it already is (`fl-ds-card`, `fl-ds-table`'s
`TableRow`, …) — this skill is just the trigger that asks for the next page.

## Step 1 — the hook

```tsx
import { useEffect, useRef } from "react";

function useInfiniteScroll(onLoadMore: () => void, { enabled = true } = {}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onLoadMore();
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [enabled, onLoadMore]);

  return sentinelRef;
}
```

## Step 2 — wire it to a list

```tsx
const sentinelRef = useInfiniteScroll(fetchNextPage, { enabled: hasNextPage && !isFetching });

<div>
  {items.map((item) => <Card key={item.id}>{item.name}</Card>)}
  <div ref={sentinelRef} />
  {isFetching && <p className="text-sm text-muted-foreground">Loading more…</p>}
</div>
```

Pairs naturally with TanStack Query's `useInfiniteQuery`
(`fetchNextPage`/`hasNextPage`/`isFetching`) if it's already in the
project — don't hand-roll cursor/offset tracking that's already there.

## Scope boundary

The scroll trigger only. For paged (not scrolling) navigation, see
`fl-ds-pagination`. For the row/card markup itself, use whichever sibling
`fl-ds-*` skill matches what's being rendered.
