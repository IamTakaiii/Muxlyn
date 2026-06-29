# Iconography

**Library**: [`lucide-react`](https://lucide.dev) v0.400+

---

## Icon Style

| Attribute | Value |
|-----------|-------|
| Library | Lucide (Feather-based) |
| Stroke | 2px, rounded caps & joins |
| Style | Outlined, minimal |
| Fill | Never filled (except `fill` variant icons) |

---

## Sizing

| Size Token | px | Usage |
|------------|----|-------|
| `xs` | 12px | Badges, inline with caption text |
| `sm` | 14px | Inside small buttons, dense lists |
| `md` | 16px | **Default** — most UI icons |
| `lg` | 20px | Button leading icons, card headers |
| `xl` | 24px | Standalone icons, empty states |
| `2xl` | 32px | Hero icons, feature highlights |

Tailwind sizing:
```html
<Icon size={16} />                           <!-- md -->
<Icon className="size-4" />                  <!-- md (16px) -->
<Icon className="size-5" />                  <!-- lg (20px) -->
```

---

## Color Mapping

Icons inherit currentColor. Use text tokens:

| Context | Class | Token |
|---------|-------|-------|
| Default UI | `text-foreground` | `text-primary` |
| Muted / secondary | `text-muted-foreground` | `text-secondary` |
| Brand / interactive | `text-primary` | brand-500 |
| On brand bg | `text-primary-foreground` | `text-on-brand` |
| Danger | `text-destructive` | danger-500 |
| Success | `text-success` | success-500 |
| Warning | `text-warning` | warning-500 |
| Disabled | `text-neutral-300` | neutral-300 |

---

## Icon Selection Rules

1. **Prefer lucide-react built-ins** — do not create custom SVGs unless no Lucide icon matches (check https://lucide.dev/icons first)
2. **Consistent stroke** — all icons in a group use same `size` prop
3. **Semantic pairing** — use `CircleCheck` for success, `CircleAlert` for warning, `CircleX` for danger
4. **Interactive icons have hover/active states** — `hover:text-primary active:text-brand-700`
5. **Decorative icons get `aria-hidden="true"`** — Lucide does this by default
6. **Standalone icons need a label** — wrap in a button with `aria-label` or pair with visible text

---

## Common Icon Map

| Concept | Icon (Lucide) |
|---------|---------------|
| Add / Create | `Plus` |
| Edit | `Pencil` or `SquarePen` |
| Delete / Remove | `Trash2` |
| Search | `Search` |
| Settings | `Settings` |
| User / Profile | `User` or `CircleUser` |
| Menu / Navigation | `Menu` |
| Close / Dismiss | `X` |
| Check / Confirm | `Check` |
| Copy | `Copy` or `Clipboard` |
| External link | `ExternalLink` |
| Calendar | `Calendar` |
| Clock / Time | `Clock` |
| Filter | `ListFilter` or `SlidersHorizontal` |
| Sort | `ArrowUpDown` |
| Refresh | `RefreshCw` |
| Loading | `Loader2` (with `animate-spin`) |
| Jira / Worklog | `Timer` or `Clock4` |
| Dashboard | `LayoutDashboard` |
