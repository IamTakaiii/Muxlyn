# Card

## Purpose
Container grouping related content. Clean surface with border or shadow.

## Anatomy
- **Card container** — `bg-card`, border, rounded-lg, optional shadow
- **Card Header** — title + description + action (optional)
- **Card Content** — main body area
- **Card Footer** — actions, metadata (optional)

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard card with border |
| `elevated` | Card with shadow, no border (hover lift) |
| `flat` | No border, no shadow, bg only |

## Sizes

| Size | Padding |
|------|---------|
| `sm` | P: `spacing-4` (16px) |
| `md` | P: `spacing-6` (24px) |
| `lg` | P: `spacing-8` (32px) |

## States

| State | Styling |
|-------|---------|
| **Default** | `bg-card border rounded-lg` |
| **Hover (elevated)** | Shadow increases from none → `shadow-md` |
| **Selected** | `ring-2 ring-ring border-ring` |
| **Loading** | Skeleton overlay on content area |
| **Empty** | Centered empty state with icon + message |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--card` | Background |
| `--card-foreground` | Text |
| `--border` | Border |
| `--radius-lg` (12px) | Container radius |
| `--shadow-md` | Elevated variant |

## Accessibility
- Role: `region` (if it has an accessible name)
- Use `aria-labelledby` pointing to card title, or `aria-label`
- No special keyboard interaction (content container only)

## Do / Don't
- **Do**: Use consistent padding for all cards on the same page
- **Do**: Add `CardHeader` only when card has a title
- **Do**: Group related actions in `CardFooter`
- **Don't**: Nest cards inside cards
- **Don't**: Mix elevated and default cards on the same page

## Code Example

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-heading-sm font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```
