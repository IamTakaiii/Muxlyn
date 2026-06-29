# Accessibility

**Target**: WCAG 2.1 Level AA

---

## Contrast Requirements

| Element | Minimum Ratio | Standard |
|---------|---------------|----------|
| Body text (<18px, not bold) | 4.5:1 | WCAG AA |
| Large text (≥18px, or ≥14px bold) | 3:1 | WCAG AA |
| UI components & graphical objects | 3:1 | WCAG AA |

---

## Contrast Report

All intended semantic pairs pass WCAG AA. ✅

| Pair | Ratio | Status |
|------|-------|--------|
| `text-primary` on `surface-background` | 16.74:1 | ✅ AAA |
| `text-primary` on `surface-card` | 17.49:1 | ✅ AAA |
| `text-primary` on `surface-raised` | 16.03:1 | ✅ AAA |
| `text-secondary` on `surface-background` | 7.30:1 | ✅ AA |
| `text-secondary` on `surface-card` | 7.63:1 | ✅ AA |
| `text-secondary` on `surface-raised` | 6.99:1 | ✅ AA |
| `text-muted` on `surface-background` | 4.59:1 | ✅ AA |
| `text-muted` on `surface-card` | 4.80:1 | ✅ AA |
| `text-link` on `surface-background` | 5.68:1 | ✅ AA |
| `text-link` on `surface-card` | 5.93:1 | ✅ AA |

### False positives (semantically invalid pairs)

The contrast checker reports failures for these — they are **never used together**:

| Pair | Why it's fine |
|------|---------------|
| `text.inverse` on light surfaces | `text.inverse` (white) is only used on dark/brand backgrounds |
| `text.on-brand` on light surfaces | `text.on-brand` (white) is only used on branded elements |
| Any text on `surface.overlay` | Overlay (`#0000001a`) is a backdrop layer, never a text background |

---

## Focus & Keyboard

### Focus Visible

Every interactive element must show a visible focus ring:

```css
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

In Tailwind: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

### Tab Order

- Interactive elements must be reachable via `Tab` key
- Tab order follows visual/DOM order
- No positive `tabindex` values — use `tabindex="0"` or `tabindex="-1"` only
- Modal open = trap focus inside modal
- Modal close = return focus to trigger element

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` / `Shift+Tab` | Navigate between interactive elements |
| `Enter` / `Space` | Activate button, toggle checkbox |
| `Escape` | Close modal, dropdown, popover |
| `ArrowDown` / `ArrowUp` | Navigate list/select options |
| `Home` / `End` | Jump to first/last in list |
| `⌘K` | Open command palette |

---

## Screen Readers

### Labels & Descriptions

```tsx
// ✅ Good — explicit label
<label htmlFor="email">Email</label>
<Input id="email" />

// ✅ Good — aria-label for icon-only buttons
<Button aria-label="Close dialog">
  <X size={16} />
</Button>

// ❌ Bad — no accessible name
<Button><X size={16} /></Button>
```

### Status Announcements

```tsx
// Use role="alert" or aria-live for dynamic content
<div role="alert" className="sr-only">
  {errorMessage}
</div>

// Toast container
<div aria-live="polite" aria-label="Notifications">
  {/* toasts */}
</div>
```

### ARIA Patterns

| Component | Role | Key ARIA |
|-----------|------|----------|
| Button | `button` (implicit) | `aria-disabled`, `aria-label` |
| Input | `textbox` (implicit) | `aria-invalid`, `aria-describedby` |
| Select | `combobox` or `listbox` | `aria-expanded`, `aria-activedescendant` |
| Modal | `dialog` | `aria-modal="true"`, `aria-labelledby` |
| Toast | `status` or `alert` | `aria-live="polite"` |
| Tabs | `tablist` / `tab` / `tabpanel` | `aria-selected`, `aria-controls` |
| Switch | `switch` | `aria-checked` |
| Progress | `progressbar` | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Tooltip | `tooltip` | `aria-describedby` on trigger |
| Accordion | `region` | `aria-expanded`, `aria-controls` |

---

## Color & Sensory

1. **No information by color alone** — always pair status with an icon or text label
2. **Error states include text** — red border + error message, not just red border
3. **Required fields** — use asterisk `*` + `aria-required="true"`, not just color change
4. **Dark mode tested** — all components verified in both light and dark

---

## Touch & Mobile

- Minimum touch target: **44×44px**
- Buttons smaller than 44px must extend their hit area with invisible padding
- Swipe gestures must have a keyboard equivalent

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Tailwind, wrap animated elements with `motion-safe:` prefix.
