# Alert

## Purpose
In-context status message. Stays visible until dismissed or condition changes.

## Anatomy
- **Alert container** — full-width, colored left border or bg tint
- **Icon** (left) — contextual
- **Title** — bold heading
- **Description** — body text
- **Dismiss button** (optional) — X icon

## Variants

| Variant | Border/Accent | Bg |
|---------|---------------|----|
| `default` | `--border` | `--muted` |
| `success` | `--success` green | `--success` 5% bg |
| `warning` | `--warning` amber | `--warning` 5% bg |
| `danger` | `--destructive` rose | `--destructive` 5% bg |
| `info` | `--info` sky | `--info` 5% bg |

## States

| State | Behavior |
|-------|----------|
| **Visible** | Full alert displayed |
| **Dismissing** | Fade out + slide up (if animated) |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--border` | Default variant acccent |
| `--muted` | Default variant bg |
| `--radius-md` (8px) | Container corners |
| `--success/warning/destructive/info` | Accent colors |

## Accessibility
- Role: `alert` (if critical) or `status`
- Always visible without user interaction (unlike Toast)
- Dismiss button must have `aria-label`
- Color + icon conveys meaning (not color alone)

## Do / Don't
- **Do**: Use for form-level errors, status banners, permission warnings
- **Do**: Put Alerts close to the relevant content
- **Don't**: Use Alert for ephemeral notifications — use Toast
- **Don't**: Stack multiple alerts without clear hierarchy

## Code Example

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, CircleX, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border p-4 [&>svg~div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground [&>svg]:text-foreground",
        success: "border-success/50 bg-success/5 text-foreground [&>svg]:text-success",
        warning: "border-warning/50 bg-warning/5 text-foreground [&>svg]:text-warning",
        danger:  "border-destructive/50 bg-destructive/5 text-foreground [&>svg]:text-destructive",
        info:    "border-info/50 bg-info/5 text-foreground [&>svg]:text-info",
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

interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

function Alert({ variant = "default", title, children, onDismiss, className }: AlertProps) {
  const Icon = icons[variant as keyof typeof icons];

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)}>
      {Icon && <Icon size={16} />}
      <div className={Icon ? "ml-6" : ""}>
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        <div className="text-sm [&_p]:leading-relaxed">{children}</div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="absolute right-3 top-3 rounded-sm opacity-70 transition-opacity hover:opacity-100">
          <X size={14} />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </div>
  );
}

export { Alert, type AlertProps };
```
