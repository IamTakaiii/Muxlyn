# Progress

## Purpose
Visualize task completion. Determinate or indeterminate.

## Anatomy
- **Track** — full-width bar, `bg-secondary`, rounded-full
- **Indicator** — colored fill, `bg-primary`, rounded-full, animated width

## Variants

| Variant | Usage |
|---------|-------|
| `determinate` | Known completion % (file upload, form steps) |
| `indeterminate` | Unknown duration (loading, fetching data) |

## Sizes

| Size | Height |
|------|--------|
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |

## States

| State | Indicator |
|-------|-----------|
| **Determinate** | Width transitions smoothly, `bg-primary` |
| **Indeterminate** | Animated sliding gradient |
| **Complete** | `bg-success`, optionally auto-dismiss |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--primary` | Indicator fill |
| `--secondary` | Track bg |
| `--success` | Complete state |
| `--radius-full` | Track + indicator corners |
| `--motion-duration-slow` (320ms) | Width transition |

## Accessibility
- Role: `progressbar`
- `aria-valuenow` (current %)
- `aria-valuemin="0"`, `aria-valuemax="100"`
- `aria-valuetext` for human-readable status ("45% complete", "Uploading...")
- Indeterminate: omit `aria-valuenow`

## Do / Don't
- **Do**: Show percentage text alongside for important progress (upload, onboarding)
- **Do**: Use determinate when you can compute progress
- **Do**: Color the indicator `bg-success` at 100%
- **Don't**: Use indeterminate for things that can be quantified
- **Don't**: Animate determinate bar too fast — 320ms transitions max

## Code Example

```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100, undefined for indeterminate
  size?: "sm" | "md" | "lg";
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, size = "md", ...props }, ref) => {
    const isIndeterminate = value === undefined;
    const height = { sm: "h-2", md: "h-3", lg: "h-4" }[size];

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={isIndeterminate ? "Loading..." : `${value}%`}
        className={cn("relative w-full overflow-hidden rounded-full bg-secondary", height, className)}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-slow ease-standard",
            isIndeterminate
              ? "w-1/2 animate-indeterminate bg-primary"
              : value === 100
                ? "bg-success"
                : "bg-primary"
          )}
          style={isIndeterminate ? undefined : { width: `${value}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
```
