# Tabs

## Purpose
Alternate views within the same context. User switches between panels.

## Anatomy
- **Tab list** — horizontal row of triggers
- **Tab trigger** — individual tab button with label (+ optional icon)
- **Active indicator** — bottom border/underline on active tab
- **Tab panel** — content area (renders one at a time)

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Underline indicator, equal-width tabs |
| `pills` | Rounded background highlight on active tab |
| `segmented` | Connected buttons, iOS-style |

## Sizes

| Size | Trigger H | Font | PX |
|------|-----------|------|-----|
| `sm` | 32px | `text-sm` | 12px |
| `md` | 40px | `text-sm` | 16px |

## States

| State | Styling |
|-------|---------|
| **Inactive** | `text-muted-foreground` |
| **Active** | `text-foreground font-medium`, underline in `--primary` |
| **Hover (inactive)** | `text-foreground bg-accent` (pills) or just `text-foreground` (default) |
| **Focus** | `ring-2 ring-ring ring-inset` |
| **Disabled** | `opacity-50 cursor-not-allowed` |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--primary` | Active indicator |
| `--muted-foreground` | Inactive text |
| `--foreground` | Active text |
| `--ring` | Focus ring |
| `--border` | Tab list bottom border (default variant) |

## Accessibility
- Roles: `tablist`, `tab`, `tabpanel`
- `aria-selected="true|false"` on each tab
- `aria-controls` on tab pointing to panel id
- `aria-labelledby` on panel pointing to tab id
- `ArrowLeft/Right` to switch tabs, `Home/End` for first/last
- `Tab` to enter tab list, then arrow keys within

## Do / Don't
- **Do**: Use for 2–8 tabs; more than 8 → consider dropdown or sidebar
- **Do**: Keep tab labels short (1–2 words)
- **Do**: Preserve selected tab in URL query params for deep-linking
- **Don't**: Use Tabs for navigation between pages — use links
- **Don't**: Nest tabs

## Code Example

```tsx
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium " +
      "ring-offset-background transition-all duration-fast " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
      "disabled:pointer-events-none disabled:opacity-50 " +
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
```
