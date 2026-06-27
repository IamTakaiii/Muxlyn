# Motion

---

## Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `duration-instant` | 0ms | Instant state changes (selection, toggle) |
| `duration-fast` | 120ms | Micro-interactions: hover, focus ring, ripple |
| `duration-base` | 200ms | **Default** — button press, show/hide, expand |
| `duration-slow` | 320ms | Modal enter/exit, page transitions |
| `duration-slower` | 500ms | Complex animations, onboarding |

---

## Easing Tokens

| Token | Value | Usage | Curve |
|-------|-------|-------|-------|
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default for UI elements | Decelerate |
| `ease-emphasized` | `cubic-bezier(0.3, 0, 0, 1)` | Entrance animations, modals | Pronounced ease |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements **entering** | Pure decelerate |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements **exiting** | Pure accelerate |

---

## Tailwind Mapping

```js
transitionDuration: {
  instant: '0ms',
  fast:    '120ms',
  base:    '200ms',  // DEFAULT
  slow:    '320ms',
  slower:  '500ms',
},
transitionTimingFunction: {
  standard:   'cubic-bezier(0.2, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
  out:        'cubic-bezier(0, 0, 0.2, 1)',
  in:         'cubic-bezier(0.4, 0, 1, 1)',
},
```

---

## Component Presets

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover bg change | `fast` (120ms) | `standard` |
| Focus ring appear | `fast` (120ms) | `out` |
| Dropdown open | `fast` (120ms) | `out` |
| Dropdown close | `fast` (120ms) | `in` |
| Modal enter | `slow` (320ms) | `emphasized` |
| Modal exit | `fast` (120ms) | `in` |
| Toast enter (slide) | `slow` (320ms) | `emphasized` |
| Toast exit | `base` (200ms) | `in` |
| Sheet (drawer) enter | `slow` (320ms) | `emphasized` |
| Tooltip show/hide | `fast` (120ms) | `out` / `in` |
| Accordion expand | `slow` (320ms) | `standard` |
| Page transition | `slower` (500ms) | `emphasized` |

---

## Reduced Motion

Always respect the user's system preference:

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

In Tailwind, use `motion-safe:` and `motion-reduce:` prefixes:

```html
<div class="motion-safe:animate-in motion-safe:duration-slow">
```

---

## Usage Rules

1. **Entrance = ease-out, exit = ease-in** — natural motion feels like physics
2. **Fast for micro, slow for macro** — small interactions feel snappy; large transitions feel smooth
3. **Never animate layout properties** — prefer `transform` and `opacity` (GPU-composited)
4. **Respect `prefers-reduced-motion`** — always provide a static fallback
5. **Duration correlates with distance** — elements moving far need more time
