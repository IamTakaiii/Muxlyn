# Button

## Purpose
Triggers an action or navigation. The most-used interactive element.

## Anatomy
- **Label** (icon optional) — `font-medium`, `text-sm` (sm) / `text-base` (md-lg)
- **Container** — padded box with border-radius

## Variants

| Variant | Usage | Light bg | Dark bg |
|---------|-------|----------|---------|
| `primary` | Main CTA, form submit | `--primary` | `--primary` |
| `secondary` | Alternative actions | `--secondary` | `--secondary` |
| `outline` | Less prominent actions, paired with primary | transparent + border | transparent + border |
| `ghost` | Toolbar, card header actions | transparent | transparent |
| `destructive` | Delete, irreversible actions | `--destructive` | `--destructive` |
| `link` | Inline navigation, "Forgot password?" | transparent, underlined | transparent, underlined |

## Sizes

| Size | H | PX | Font | Radius |
|------|----|-----|------|--------|
| `sm` | 32px | 12px | `text-sm` (14px) | `md` |
| `md` | 40px | 16px | `text-sm` (14px) | `md` |
| `lg` | 48px | 24px | `text-base` (16px) | `md` |
| `icon-sm` | 32px | 8px | — | `md` |
| `icon-md` | 40px | 8px | — | `md` |

## States

| State | Primary | Secondary | Ghost | Outline | Destructive |
|-------|---------|-----------|-------|---------|-------------|
| **Default** | `bg-primary text-primary-foreground` | `bg-secondary text-secondary-foreground` | `text-foreground` | `border text-foreground` | `bg-destructive text-destructive-foreground` |
| **Hover** | Darken brand-600 | Darken neutral-200 | `bg-accent` | `bg-accent` | Darken rose-600 |
| **Focus** | `ring-2 ring-ring ring-offset-2` | same | same | same | same |
| **Active** | brand-700 | neutral-300 | `bg-accent` darker | `bg-accent` darker | rose-700 |
| **Disabled** | `opacity-50 cursor-not-allowed` | same | same | same | same |
| **Loading** | Disabled + spinner icon | same | same | same | same |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--primary` | Primary variant bg |
| `--primary-foreground` | Primary variant text |
| `--secondary` | Secondary variant bg |
| `--ring` | Focus ring |
| `--radius-md` (8px) | Border radius |
| `font-medium` | Label weight |

## Accessibility
- Role: `button` (implicit on `<button>`)
- Disabled: `aria-disabled="true"` + `disabled` attribute
- Loading: `aria-busy="true"` + `aria-label="Loading..."` or spinner only
- Focus: visible ring via `focus-visible:ring-2`
- Keyboard: `Enter` / `Space` to activate

## Do / Don't
- **Do**: Use `primary` for the single most important action per form
- **Do**: Use `destructive` only for irreversible actions, with confirmation
- **Do**: Always show loading state during async actions
- **Don't**: Nest buttons inside buttons
- **Don't**: Use `ghost` buttons on dark backgrounds without enough contrast
- **Don't**: Put more than 2 primary buttons in one view

## Code Example (Tailwind + CVA)

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary:   "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        outline:   "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        ghost:     "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        link:      "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        "icon-sm": "h-8 w-8",
        "icon-md": "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
```
