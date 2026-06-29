# Tooltip

## Purpose
Small floating label on hover/focus. Provides supplemental information without cluttering the UI.

## Anatomy
- **Trigger** — the element being described
- **Tooltip** — floating card with arrow (optional), short text only
- **Arrow** (optional) — points at trigger

## Sizes

| Size | Padding | Font | Max Width |
|------|---------|------|-----------|
| `sm` | `px-2 py-1` | `text-xs` | 200px |
| `md` | `px-3 py-1.5` | `text-sm` | 280px |

## Positions

Top / Bottom / Left / Right — auto-flip when viewport edge is reached.

## States

| State | Behavior |
|-------|----------|
| **Hidden** | Not rendered or opacity 0 |
| **Opening** | Fade in + slight slide (200ms) |
| **Visible** | Static display |
| **Closing** | Fade out (150ms) |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--foreground` (inverted in dark) | Text |
| `--shadow-sm` | Tooltip elevation |
| `--radius-md` (8px) | Corners |
| `--motion-duration-fast` (120ms) | Show/hide delay |

## Delay

| Phase | Duration |
|-------|----------|
| Show delay | 300ms (prevent accidental triggers) |
| Hide delay | 0ms |

## Accessibility
- Role: `tooltip`
- Trigger must have `aria-describedby` pointing to tooltip id
- Tooltip content must be short (1–2 words or short phrase)
- Show on focus as well as hover
- Not accessible on touch devices — ensure critical info is available elsewhere
- `Escape` to dismiss

## Do / Don't
- **Do**: Use for icon-only buttons to provide label
- **Do**: Keep text short — tooltip is supplementary, not a manual
- **Do**: Use `delayDuration={300}` to avoid flicker
- **Don't**: Put interactive elements inside a tooltip
- **Don't**: Use tooltip for critical information — it's not accessible on mobile

## Code Example

```tsx
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = ({ children, content, delayDuration = 300 }: {
  children: React.ReactNode;
  content: string;
  delayDuration?: number;
}) => (
  <TooltipPrimitive.Root delayDuration={delayDuration}>
    <TooltipPrimitive.Trigger asChild>
      {children}
    </TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={4}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-foreground px-3 py-1.5 text-sm text-background shadow-sm " +
          "animate-in fade-in-0 zoom-in-95 " +
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        )}
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-foreground" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);

export { Tooltip, TooltipProvider };
```
