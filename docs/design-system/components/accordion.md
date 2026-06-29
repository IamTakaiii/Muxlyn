# Accordion

## Purpose
Vertically stacked collapsible sections. Show/hide content on click.

## Anatomy
- **Accordion container** — vertical stack
- **Trigger** — clickable header row with title + chevron icon
- **Content** — expandable panel below trigger

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Single expand, border between items |
| `multiple` | Multiple sections open simultaneously |

## States

| State | Trigger | Chevron |
|-------|---------|---------|
| **Collapsed** | `text-foreground`, normal weight | Down `▾`, `rotate-0` |
| **Expanded** | `font-medium` | Up `▴`, `rotate-180` |
| **Hover** | `bg-accent` | — |
| **Focus** | `ring-2 ring-ring ring-inset` | — |
| **Disabled** | `opacity-50 cursor-not-allowed` | — |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--foreground` | Trigger text |
| `--accent` | Hover bg |
| `--border` | Item separators |
| `--ring` | Focus ring |
| `--motion-duration-slow` (320ms) | Expand/collapse |

## Accessibility
- Role: `region` (each item)
- `aria-expanded="true|false"` on trigger
- `aria-controls` on trigger → content id
- `aria-labelledby` on content → trigger id
- `Enter` / `Space` to toggle
- Multiple items: use `type="multiple"` to allow concurrent expansion

## Do / Don't
- **Do**: Use for FAQ, filter groups, settings panels
- **Do**: Animate height with `duration-slow` (320ms)
- **Do**: Keep trigger text short — 1 line only
- **Don't**: Nest accordions
- **Don't**: Put critical information inside an accordion — it may be overlooked

## Code Example

```tsx
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all " +
        "hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown size={16} className="shrink-0 transition-transform duration-base" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```
