# Input

## Purpose
Single-line text entry. The most-used form element.

## Anatomy
- **Label** (above) — `text-sm font-medium`
- **Input field** — bordered box with padding
- **Helper text** (below, optional) — `text-sm text-muted-foreground`
- **Error message** (below, on error) — `text-sm text-destructive`
- **Icon** (left or right, optional) — 16px

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard text input |
| `with-icon` | Input with leading or trailing icon |

## Sizes

| Size | H | PX |
|------|----|----|
| `sm` | 32px | 12px |
| `md` | 40px | 12px |

## States

| State | Styling |
|-------|---------|
| **Default** | `border-input bg-background text-foreground` |
| **Hover** | `border-neutral-400` |
| **Focus** | `ring-2 ring-ring ring-offset-0 border-ring` |
| **Disabled** | `opacity-50 cursor-not-allowed bg-muted` |
| **Error** | `border-destructive focus-visible:ring-destructive` |
| **Read-only** | `bg-muted cursor-default` |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--input` | Border color |
| `--background` | Background |
| `--foreground` | Text color |
| `--ring` | Focus ring |
| `--destructive` | Error border |
| `--muted` | Disabled/read-only bg |
| `--radius-md` (8px) | Border radius |

## Accessibility
- Role: `textbox` (implicit on `<input type="text">`)
- **Must have a visible `<label>`** — never rely on placeholder alone
- `aria-invalid="true"` on error
- `aria-describedby` pointing to helper text / error message id
- Placeholder is **not** a label — use for example / format hint only

## Do / Don't
- **Do**: Always pair with a visible label
- **Do**: Show error message below the input, not just red border
- **Do**: Use `type="email"`, `type="password"`, `type="number"` when appropriate
- **Don't**: Use placeholder as the only label
- **Don't**: Disable inputs without explaining why
- **Don't**: Use `input` for multiline text — use `Textarea`

## Code Example

```tsx
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={!!error}
      className={
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
        "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium " +
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
Input.displayName = "Input";

export { Input };
```

```tsx
// Usage with label and error
<div className="flex flex-col gap-1.5">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    aria-describedby="email-error"
    error={error}
  />
  {error && (
    <p id="email-error" className="text-sm text-destructive">
      {error}
    </p>
  )}
</div>
```
