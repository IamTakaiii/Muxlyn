# Breadcrumb

## Purpose
Show page hierarchy. Helps users understand their location and navigate up.

## Anatomy
- **Breadcrumb list** — horizontal `<nav>` with `<ol>`
- **Item** — link or current page text
- **Separator** — chevron or slash between items

## Variants

| Variant | Separator | Usage |
|---------|-----------|-------|
| `chevron` | `>` (default) | Standard breadcrumb |
| `slash` | `/` | Minimal, file-path style |
| `dot` | `·` | Subtle |

## States

| State | Styling |
|-------|---------|
| **Link** | `text-muted-foreground hover:text-foreground` |
| **Current (last)** | `text-foreground font-medium`, not a link |
| **Truncated** | `...` dropdown for overflow |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--muted-foreground` | Link text |
| `--foreground` | Current page text |
| `font-sans` | Text |
| `text-sm` | Font size |

## Accessibility
- Role: `navigation` with `aria-label="Breadcrumb"`
- Structured as `<ol>` for list semantics
- Current page: `aria-current="page"`
- Separators are decorative: `aria-hidden="true"`

## Do / Don't
- **Do**: Use for deep navigation (3+ levels)
- **Do**: Truncate long paths with `...` and dropdown
- **Don't**: Use for flat sites with only 1–2 levels
- **Don't**: Replace primary navigation

## Code Example

```tsx
import { ChevronRight, MoreHorizontal, Slash } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Breadcrumb = forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav">
>(({ ...props }, ref) => <nav ref={ref} aria-label="Breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn("transition-colors hover:text-foreground", className)}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("", className)}
    {...props}
  >
    {children ?? <ChevronRight size={14} />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal size={14} />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
```
