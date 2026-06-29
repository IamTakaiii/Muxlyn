# Checkbox

## Purpose
Binary on/off selection. Independent — unlike Radio which is mutually exclusive.

## Anatomy
- **Checkbox square** — 16×16px, rounded-sm, bordered
- **Check icon** — Lucide `Check` 12px, appears when checked
- **Label** (right or left) — `text-sm`

## Sizes

| Size | Box | Icon | Label font |
|------|-----|------|------------|
| `sm` | 14px | 10px | `text-xs` |
| `md` | 16px | 12px | `text-sm` |

## States

| State | Box styling |
|-------|-------------|
| **Unchecked** | `border-input bg-background` |
| **Checked** | `bg-primary border-primary text-primary-foreground` |
| **Indeterminate** | `bg-primary border-primary` (minus icon) |
| **Hover** | `border-primary` (unchecked), darken (checked) |
| **Focus** | `ring-2 ring-ring ring-offset-2` |
| **Disabled** | `opacity-50 cursor-not-allowed` |
| **Error** | `border-destructive` (unchecked only) |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--primary` | Checked bg + border |
| `--primary-foreground` | Check icon |
| `--input` | Unchecked border |
| `--ring` | Focus ring |
| `--radius-sm` (4px) | Box corners |

## Accessibility
- Role: `checkbox`
- `aria-checked="true|false|mixed"`
- Click label to toggle (wrap in `<label>` or use `htmlFor`)
- `Space` to toggle
- For grouped checkboxes: wrap in `<fieldset>` with `<legend>`

## Do / Don't
- **Do**: Use for independent options (each can be toggled alone)
- **Do**: Use indeterminate state for "select all" when some children are selected
- **Don't**: Use checkbox for mutually exclusive choices — use Radio
- **Don't**: Use checkbox to trigger immediate actions — use Switch or Button

## Code Example

```tsx
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { forwardRef } from "react";

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, indeterminate, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={
        "peer h-4 w-4 shrink-0 rounded-sm border border-input " +
        "ring-offset-background " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground " +
        "data-[state=checked]:border-primary " +
        className
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {indeterminate ? <Minus size={12} /> : <Check size={12} />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
```
