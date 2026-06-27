# Skeleton

## Purpose
Placeholder UI during content loading. Reduces perceived load time.

## Anatomy
- **Skeleton block** — animated pulse rectangle, `bg-muted`
- **Variants**: text line, circle (avatar), rectangle (card/image)

## Variants

| Variant | Usage |
|---------|-------|
| `text` | Line of text — single or multi-line |
| `circle` | Avatar, icon placeholder |
| `rectangle` | Card, image, button placeholder |

## States

| State | Styling |
|-------|---------|
| **Loading** | Animated pulse or shimmer |
| **Loaded** | Replaced by real content |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--muted` | Skeleton bg |
| `--radius-md` | Rectangle corners |
| `--radius-full` | Text/circle corners |
| `--motion-duration-slower` | Animation cycle |

## Accessibility
- `aria-busy="true"` on the loading container
- `aria-hidden="true"` on skeleton elements (they convey no info)
- Screen reader announces "Loading..."

## Do / Don't
- **Do**: Match skeleton shape to the content it replaces
- **Do**: Use multiple text lines to hint at paragraph length
- **Do**: Shimmer animation, not pure pulse (feels more active)
- **Don't**: Show skeleton for < 300ms — skip straight to content
- **Don't**: Animate skeleton indefinitely — show an error if it takes > 10s

## Code Example

```tsx
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Pre-composed variants
function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : i === 0 ? "w-full" : "w-5/6"
          )}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <SkeletonText lines={2} />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable };
```
