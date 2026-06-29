# Radio

## Purpose
Mutually exclusive single selection from a set of options. Use when all options are visible.

## Anatomy
- **Radio circle** — 16×16px, rounded-full, bordered
- **Dot indicator** — filled circle when selected, 8px
- **Label** (right) — `text-sm`
- **Group container** — fieldset with legend

## Sizes

| Size | Circle | Dot | Label |
|------|--------|-----|-------|
| `sm` | 14px | 6px | `text-xs` |
| `md` | 16px | 8px | `text-sm` |

## States

| State | Circle styling |
|-------|----------------|
| **Unselected** | `border-input bg-background` |
| **Selected** | `border-primary`, dot = `bg-primary` |
| **Hover** | `border-primary` (unselected), darken (selected) |
| **Focus** | `ring-2 ring-ring ring-offset-2` |
| **Disabled** | `opacity-50 cursor-not-allowed` |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--primary` | Selected border + dot |
| `--input` | Unselected border |
| `--ring` | Focus ring |
| `--radius-full` | Circle |

## Accessibility
- Role: `radio`
- `aria-checked="true|false"`
- Wrap in `<fieldset>` with `<legend>` for the group label
- `ArrowDown/Up/Left/Right` to change selection within group
- Click label to select

## Do / Don't
- **Do**: Use for 2–7 mutually exclusive options that are all visible
- **Do**: Always provide a default selection (or a "none" option)
- **Do**: Use vertical layout for > 3 options
- **Don't**: Use Radio when options > 7 — use Select
- **Don't**: Use Radio for toggling a single setting — use Switch

## Code Example

```tsx
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { forwardRef } from "react";

const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={
      "aspect-square h-4 w-4 rounded-full border border-input text-primary " +
      "ring-offset-background " +
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
      "disabled:cursor-not-allowed disabled:opacity-50 " +
      className
    }
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle size={8} className="fill-current text-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroupItem };
```

```tsx
// Usage
<RadioGroupPrimitive.Root defaultValue="option-a" className="flex flex-col gap-3">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-a" id="a" />
    <label htmlFor="a" className="text-sm">Option A</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option-b" id="b" />
    <label htmlFor="b" className="text-sm">Option B</label>
  </div>
</RadioGroupPrimitive.Root>
```
