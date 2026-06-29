# Textarea

## Purpose
Multi-line text entry. For descriptions, comments, or any longer freeform input.

## Anatomy
- **Label** (above) — same as Input
- **Textarea field** — bordered box, resizable
- **Character count** (optional, bottom-right) — `text-xs text-muted-foreground`
- **Error message** (below) — same as Input

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard textarea |
| `auto-resize` | Grows with content, no manual resize |

## Sizes

| Size | Min H | PX | PY |
|------|-------|----|----|
| `sm` | 64px | 12px | 8px |
| `md` | 80px | 12px | 8px |

## States

| State | Styling |
|-------|---------|
| **Default** | `border-input bg-background text-foreground` |
| **Hover** | `border-neutral-400` |
| **Focus** | `ring-2 ring-ring border-ring` |
| **Disabled** | `opacity-50 cursor-not-allowed bg-muted` |
| **Error** | `border-destructive ring-destructive` |
| **Read-only** | `bg-muted` |

## Tokens Used

Same as Input, plus:
- `--radius-md` (8px)
- `font-mono` (if displaying code/JSON)

## Accessibility
- Role: `textbox` with `aria-multiline="true"`
- Same label, error, focus rules as Input
- For code/text that should not wrap, set `white-space: pre` or `nowrap`

## Do / Don't
- **Do**: Set `rows` attribute for expected content length (3–5 rows default)
- **Do**: Allow vertical resize by default (`resize-y`), disable for constrained layouts
- **Do**: Show character count when there's a limit
- **Don't**: Use `resize-none` without good reason
- **Don't**: Make textarea smaller than 3 rows

## Code Example

```tsx
import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={!!error}
      className={
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
        "placeholder:text-muted-foreground " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        (error ? "border-destructive focus-visible:ring-destructive" : "") +
        " " + (className ?? "")
      }
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
```
