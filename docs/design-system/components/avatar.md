# Avatar

## Purpose
User/profile image. Shows initials fallback when image is unavailable.

## Anatomy
- **Image** — `<img>` with `border-radius: full`
- **Fallback** — initials (1-2 chars), centered, `bg-muted`
- **Status dot** (optional) — bottom-right colored circle

## Sizes

| Size | Dimensions | Font (fallback) |
|------|-----------|-----------------|
| `xs` | 24×24px | `text-xs` 10px |
| `sm` | 32×32px | `text-sm` 14px |
| `md` | 40×40px | `text-base` 16px |
| `lg` | 48×48px | `text-lg` 18px |
| `xl` | 64×64px | `text-xl` 22px |
| `2xl` | 96×96px | `text-3xl` 30px |

## Variants

| Variant | Usage |
|---------|-------|
| `circle` | Default, rounded-full |
| `square` | For org/team logos |

## Groups

Stack avatars with overlap for multi-user display (show +N for overflow):

```tsx
<div className="flex -space-x-2">
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
  <Avatar>+3</Avatar>
</div>
```

## Tokens Used

| Token | Usage |
|-------|-------|
| `--muted` | Fallback bg |
| `--muted-foreground` | Fallback text |
| `--radius-full` | Circle avatar |
| `--radius-md` | Square avatar |

## Accessibility
- Decorative avatar (next to user's name): `alt=""` or `aria-hidden="true"`
- Standalone avatar: `alt="User name"` or `aria-label="User name"`

## Do / Don't
- **Do**: Use initials as fallback when no image
- **Do**: Add status dot for online/offline indicators
- **Do**: Show tooltip on hover with full name
- **Don't**: Use avatar without a fallback — always render initials

## Code Example

```tsx
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Avatar = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
```
