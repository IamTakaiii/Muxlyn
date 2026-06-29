# Sheet (Drawer)

## Purpose
Panel that slides in from the edge of the screen. For secondary content, filters, or mobile nav.

## Anatomy
- **Overlay** — semi-transparent backdrop
- **Sheet panel** — sliding panel with header, content, footer
- **Close button** — X icon, top-right corner
- **Header** — title + description (optional)
- **Content** — scrollable body
- **Footer** — actions (optional)

## Variants

| Variant | Usage |
|---------|-------|
| `right` | Settings panel, detail view, cart |
| `left` | Mobile navigation, filter sidebar |
| `top` | Announcement, full-width action |
| `bottom` | Mobile action sheet, bottom sheet |

## Sizes

| Variant | Width/Height |
|---------|-------------|
| `right` / `left` | 400px default, `sm`: 300px, `lg`: 540px, `xl`: 720px |
| `top` / `bottom` | Auto height based on content |

## States

| State | Behavior |
|-------|----------|
| **Closed** | Panel hidden, overlay invisible |
| **Opening** | Slide in from edge, overlay fades in |
| **Open** | Panel visible, overlay @ 50% opacity |
| **Closing** | Slide out, overlay fades out |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--background` | Panel bg |
| `--foreground` | Text |
| `--border` | Header/footer separators |
| `--shadow-xl` | Panel shadow |
| `--radius-xl` (16px) | Top corners (top/bottom variant) |
| `surface-overlay` | Backdrop |

## Animation

| Event | Duration | Easing |
|-------|----------|--------|
| Enter | `slow` (320ms) | `emphasized` |
| Exit | `fast` (120ms) | `in` |

## Accessibility
- Role: `dialog`
- `aria-modal="true"` when open
- `aria-labelledby` pointing to header title
- Focus trapped inside sheet when open
- `Escape` to close
- Click overlay to close (with confirmation if unsaved changes)
- Focus returns to trigger element on close

## Do / Don't
- **Do**: Use for secondary workflows that benefit from context retention
- **Do**: Close on overlay click (unless content has unsaved changes)
- **Do**: Show close button in a prominent position
- **Don't**: Use Sheet for primary navigation on desktop — use sidebar
- **Don't**: Nest sheets

## Code Example

```tsx
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;

const SheetContent = forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
  }
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-background p-6 shadow-xl transition duration-slow ease-emphasized",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        side === "left"  && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        side === "top"   && "inset-x-0 top-0 border-b",
        side === "bottom"&& "inset-x-0 bottom-0 border-t",
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X size={16} />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

const SheetTitle = forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
```
