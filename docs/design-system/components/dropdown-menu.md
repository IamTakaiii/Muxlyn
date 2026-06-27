# Dropdown Menu

## Purpose
Contextual menu of actions. Appears on click near the trigger element.

## Anatomy
- **Trigger** — button that opens the menu
- **Menu** — popover card with list of items
- **Item** — text + optional icon + optional shortcut
- **Separator** — divider between groups
- **Label** — non-interactive group header
- **Submenu** — nested menu (optional, prefer flat menus)

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard dropdown |
| `with-checkbox` | Multi-select menu |
| `with-radio` | Single-select menu |

## States

| State | Styling |
|-------|---------|
| **Closed** | Hidden |
| **Open** | Visible popover |
| **Item default** | `text-foreground` |
| **Item hover/focus** | `bg-accent text-accent-foreground` |
| **Item disabled** | `opacity-50 cursor-not-allowed` |
| **Item danger** | `text-destructive hover:bg-destructive/10` |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--background` (popover) | Menu bg |
| `--foreground` | Item text |
| `--accent` | Item hover bg |
| `--destructive` | Danger item text |
| `--border` | Item separators |
| `--shadow-md` | Menu elevation |
| `--radius-md` (8px) | Menu corners |

## Animation

| Event | Duration | Easing |
|-------|----------|--------|
| Open | `fast` (120ms) | `out` |
| Close | `fast` (120ms) | `in` |

## Accessibility
- Role: `menu` (actions) or `listbox` (selection)
- Trigger: `aria-haspopup="menu"`, `aria-expanded`
- Items: `role="menuitem"`, `tabIndex={-1}`
- `ArrowDown/Up` to navigate, `Enter` to select, `Escape` to close
- Focus trapped inside menu when open
- First item focused on open

## Do / Don't
- **Do**: Group related actions with separators
- **Do**: Add keyboard shortcuts (right-aligned, `text-muted-foreground`)
- **Do**: Use danger styling for destructive actions, placed at bottom after separator
- **Don't**: Use more than 2 levels of nesting
- **Don't**: Place disabled items in the middle of a menu

## Code Example

```tsx
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md " +
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none " +
      "transition-colors focus:bg-accent focus:text-accent-foreground " +
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
```
