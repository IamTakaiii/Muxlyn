# Switch (Toggle)

## Purpose
Instant on/off toggle for a setting. Effect is immediate — no form submit needed.

## Anatomy
- **Track** — rounded-full background, 44×24px (md)
- **Thumb** — white circle, moves left/right, 20px
- **Label** (right, optional) — `text-sm`

## Sizes

| Size | Track (W×H) | Thumb |
|------|-------------|-------|
| `sm` | 36×20px | 16px |
| `md` | 44×24px | 20px |

## States

| State | Track | Thumb |
|-------|-------|-------|
| **Off** | `bg-input` | Left, `bg-background` |
| **On** | `bg-primary` | Right, `bg-background` |
| **Hover** | Slight darken | — |
| **Focus** | `ring-2 ring-ring ring-offset-2` | — |
| **Disabled** | `opacity-50 cursor-not-allowed` | — |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--primary` | On track bg |
| `--input` | Off track bg |
| `--background` | Thumb |
| `--ring` | Focus ring |
| `--radius-full` | Track + thumb |

## Accessibility
- Role: `switch`
- `aria-checked="true|false"`
- Click or `Space` to toggle
- Label via `<label htmlFor>` or `aria-label` (for standalone switches)

## Do / Don't
- **Do**: Use for instant-apply settings (dark mode, notifications on/off)
- **Do**: Pair with a label that describes the current state ("Notifications on")
- **Don't**: Use Switch for form choices that need submission — use Checkbox
- **Don't**: Use without a visible label

## Code Example

```tsx
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef } from "react";

const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent " +
      "transition-colors duration-fast " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
      "disabled:cursor-not-allowed disabled:opacity-50 " +
      "data-[state=checked]:bg-primary " +
      "data-[state=unchecked]:bg-input " +
      className
    }
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm " +
        "ring-0 transition-transform duration-fast " +
        "data-[state=checked]:translate-x-5 " +
        "data-[state=unchecked]:translate-x-0"
      }
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

export { Switch };
```
