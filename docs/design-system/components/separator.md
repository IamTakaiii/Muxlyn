# Separator

## Purpose
Visual divider between sections or items. Horizontal or vertical.

## Anatomy
- **Line** — 1px solid, `bg-border`

## Variants

| Variant | Usage |
|---------|-------|
| `horizontal` | Between sections, in lists, under headers |
| `vertical` | Between toolbars, in complex headers |

## Orientation

| Orientation | Width/Height | Default Margin |
|-------------|-------------|----------------|
| Horizontal | 100% wide × 1px | `my-4` |
| Vertical | 1px × 100% tall | `mx-4` |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--border` | Line color |

## Accessibility
- Role: `separator` (implicit via `<Separator />`)
- `aria-orientation="horizontal|vertical"`
- Decorative separators: `role="none"` or `aria-hidden="true"`

## Do / Don't
- **Do**: Use between logically distinct sections
- **Do**: Use vertical separators sparingly in headers/toolbars
- **Don't**: Overuse — cards with headers rarely need separators
- **Don't**: Nest separators inside other separators

## Code Example

```tsx
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Separator = forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };
```
