# Badge

## Purpose
Small label for status, count, or categorization. Inline, non-interactive (usually).

## Anatomy
- **Badge** — pill-shaped container with text
- **Icon** (optional, left) — 12px
- **Dot** (optional) — colored circle for status indicator

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Neutral label, category |
| `primary` | Brand highlight, count |
| `success` | Completed, active, online |
| `warning` | Pending, in-progress |
| `danger` | Error, cancelled, offline |
| `outline` | Subtle, secondary information |

## Sizes

| Size | H | PX | Font |
|------|----|-----|------|
| `sm` | 20px | 8px | `text-xs` |
| `md` | 24px | 10px | `text-xs` |
| `lg` | 28px | 12px | `text-sm` |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--primary` | Primary variant bg |
| `--primary-foreground` | Primary variant text |
| `--success/warning/destructive` | Semantic variants |
| `--radius-full` | Pill shape |

## Accessibility
- Role: generic (presentational), unless interactive
- Color + text conveys meaning (not color alone)
- Use `aria-label` if badge is icon-only

## Do / Don't
- **Do**: Use for status labels (e.g., "Active", "Pending", "Error")
- **Do**: Use outline variant for secondary metadata (e.g., "Jira", "Worklog")
- **Do**: Keep text short — 1–2 words max
- **Don't**: Use badge for interactive elements — use Button size sm
- **Don't**: Stack badges horizontally without gap

## Code Example

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:  "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success:  "border-transparent bg-success/15 text-success-foreground",
        warning:  "border-transparent bg-warning/15 text-warning-foreground",
        danger:   "border-transparent bg-destructive/15 text-destructive",
        outline:  "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```
