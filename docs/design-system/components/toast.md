# Toast

## Purpose
Brief, non-blocking notification. Appears at screen edge, auto-dismisses.

## Anatomy
- **Toast container** — fixed position (bottom-right or top-right)
- **Icon** (left) — contextual (success/warning/danger/info)
- **Title** — bold, short message
- **Description** (optional) — additional detail
- **Action button** (optional) — e.g., "Undo"
- **Close button** (X) — top-right

## Variants

| Variant | Icon | Color |
|---------|------|-------|
| `default` | None | `--background` |
| `success` | `CircleCheck` | `--success` (green) |
| `warning` | `CircleAlert` | `--warning` (amber) |
| `danger` | `CircleX` | `--destructive` (rose) |
| `info` | `Info` | `--info` (sky) |

## Position

| Position | Usage |
|----------|-------|
| `top-right` | Default |
| `top-center` | Global alerts |
| `bottom-right` | Form notifications, save confirmations |
| `bottom-center` | Mobile layout |

## States

| State | Behavior |
|-------|----------|
| **Entering** | Slide in + fade in from edge |
| **Visible** | Static display for 4-5 seconds |
| **Exiting** | Slide out + fade out |
| **Hover** | Pause auto-dismiss timer |
| **Action** | Button click fires callback, toast stays or dismisses |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--background` | Toast bg |
| `--foreground` | Text |
| `--border` | Toast border |
| `--shadow-md` | Toast elevation |
| `--radius-lg` (12px) | Toast corners |
| `--success`, `--warning`, `--destructive`, `--info` | Left border accent |

## Animation

| Event | Duration | Easing |
|-------|----------|--------|
| Enter | `slow` (320ms) | `emphasized` |
| Exit | `base` (200ms) | `in` |

## Accessibility
- Role: `status` (polite) or `alert` (assertive for danger)
- Container: `aria-live="polite"` with `aria-label="Notifications"`
- Each toast: `role="status"` or `role="alert"`
- Auto-dismiss: 5000ms default, pause on hover
- Close button must have `aria-label="Close"`

## Do / Don't
- **Do**: Keep title under 30 characters
- **Do**: Use `success` for confirmations, `danger` for errors
- **Do**: Provide "Undo" action where possible
- **Don't**: Stack more than 3 toasts at once
- **Don't**: Put critical information in toasts — it disappears

## Code Example

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, CircleX, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center gap-3 rounded-lg border p-4 shadow-md transition-all " +
  "data-[state=open]:animate-in data-[state=closed]:animate-out " +
  "data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 " +
  "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "border-success/50 bg-success/5 text-foreground",
        warning: "border-warning/50 bg-warning/5 text-foreground",
        danger:  "border-destructive/50 bg-destructive/5 text-foreground",
        info:    "border-info/50 bg-info/5 text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const icons = {
  success: CircleCheck,
  warning: CircleAlert,
  danger: CircleX,
  info: Info,
};

interface ToastProps extends VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  onClose: () => void;
}

function Toast({ variant = "default", title, description, action, onClose }: ToastProps) {
  const Icon = icons[variant as keyof typeof icons];

  return (
    <div className={toastVariants({ variant })}>
      {Icon && <Icon size={16} className="shrink-0" />}
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <button onClick={action.onClick} className="text-sm font-medium text-primary hover:underline">
          {action.label}
        </button>
      )}
      <button onClick={onClose} className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100">
        <X size={14} />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}

export { Toast, type ToastProps };
```
