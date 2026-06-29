# Select

## Purpose
Choose one option from a dropdown list. Replaces native `<select>` for consistent styling.

## Anatomy
- **Trigger** — styled like Input, with chevron icon
- **Dropdown** — popover with options list (uses Popover/Command internally)
- **Option items** — hoverable, selectable, checkable
- **Scroll area** — if > 8 items

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard select |
| `inline` | Compact, no border, for toolbar/filter bars |

## Sizes

| Size | Trigger H | Chevon |
|------|-----------|--------|
| `sm` | 32px | 14px |
| `md` | 40px | 16px |

## States

| State | Trigger |
|-------|---------|
| **Default** | `border-input bg-background` |
| **Open** | `ring-2 ring-ring border-ring` |
| **Hover** | `border-neutral-400` |
| **Disabled** | `opacity-50 cursor-not-allowed` |
| **Error** | `border-destructive` |
| **Placeholder** | `text-muted-foreground` (no item selected) |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--input` | Border |
| `--background` | Trigger bg |
| `--foreground` | Selected text |
| `--ring` | Focus ring |
| `--radius-md` | Trigger + dropdown radius |
| `--shadow-sm` | Dropdown shadow |
| `font-mono` | If displaying technical keys |

## Accessibility
- Role: `combobox`
- `aria-expanded` on trigger
- `aria-activedescendant` during keyboard nav
- `ArrowUp/Down` to navigate, `Enter` to select, `Escape` to close
- Option `role="option"` with `aria-selected`
- Focus returns to trigger after selection

## Do / Don't
- **Do**: Group related options with labels when > 8 options
- **Do**: Show a search input when > 15 options
- **Do**: Use `placeholder` prop to show instructional text when empty
- **Don't**: Use Select for < 3 options — consider Radio group instead
- **Don't**: Nest Select inside a scrollable container without `position: fixed` portal

## Code Example

```tsx
// Using shadcn/ui Select pattern
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { forwardRef } from "react";

const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm " +
      "ring-offset-background placeholder:text-muted-foreground " +
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 " +
      "disabled:cursor-not-allowed disabled:opacity-50 " +
      "[&>span]:line-clamp-1 " +
      className
    }
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown size={16} className="opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
```

Full implementation uses `@radix-ui/react-select` with the standard shadcn/ui pattern.
