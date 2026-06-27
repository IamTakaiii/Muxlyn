# Modal (Dialog)

## Purpose
Focused overlay for confirmations, forms, or detail views. Requires user action to dismiss.

## Anatomy
- **Overlay** — semi-transparent backdrop
- **Dialog** — centered card with shadow
- **Header** — title + description + close button
- **Content** — scrollable body
- **Footer** — action buttons (cancel + confirm)

## Sizes

| Size | Max Width |
|------|-----------|
| `sm` | 400px |
| `md` | 520px |
| `lg` | 640px |
| `xl` | 800px |
| `full` | 100vw - 64px |

## States

| State | Behavior |
|-------|----------|
| **Closed** | Hidden |
| **Opening** | Scale 95%→100%, opacity 0→1, overlay fades in |
| **Open** | Visible, focus trapped |
| **Closing** | Scale 100%→95%, opacity 1→0 |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--background` | Dialog bg |
| `--foreground` | Text |
| `--border` | Separators |
| `--shadow-lg` | Dialog elevation |
| `--radius-xl` (16px) | Dialog corners |
| `surface-overlay` | Backdrop |

## Animation

| Event | Duration | Easing |
|-------|----------|--------|
| Enter | `slow` (320ms) | `emphasized` |
| Exit | `base` (200ms) | `in` |

## Accessibility
- Role: `dialog` or `alertdialog` (for destructive confirmations)
- `aria-modal="true"`
- `aria-labelledby` → title
- `aria-describedby` → description
- Focus trapped inside dialog
- `Escape` to close
- Focus returns to trigger element on close
- Click overlay to close (unless `alertdialog` or unsaved changes)

## Do / Don't
- **Do**: Use `alertdialog` for destructive confirmations
- **Do**: Auto-focus the primary action button on open
- **Do**: Show a clear close button (X) in the header
- **Don't**: Open a modal from within another modal
- **Don't**: Make modals scroll the page behind them (use `overflow: hidden` on body)
- **Don't**: Use modals for simple notifications — use Toast

## Code Example

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg " +
        "duration-base " +
        "data-[state=open]:animate-in data-[state=closed]:animate-out " +
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] " +
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] " +
        "rounded-xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X size={16} />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));

const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
```
