# Colors

**Theme**: Soft Sky Blue + Warm Gray · **Mood**: สบายตา มืออาชีพ modern

---

## Brand — Sky Blue

| Step | Hex | Swatch | Usage |
|------|-----|--------|-------|
| 50 | `#f0f9ff` | ██████ | Info surface, highlight background |
| 100 | `#e0f2fe` | ██████ | Selected state bg, info badge bg |
| 200 | `#bae6fd` | ██████ | Focus ring glow, progress track |
| 300 | `#7dd3fc` | ██████ | Ring color light |
| 400 | `#38bdf8` | ██████ | **Dark mode primary**, hover state |
| 500 | `#0ea5e9` | ██████ | **Primary** — buttons, links, brand |
| 600 | `#0284c7` | ██████ | Primary hover / active |
| 700 | `#0369a1` | ██████ | Link text, primary text on light |
| 800 | `#075985` | ██████ | Dark primary backgrounds |
| 900 | `#0c4a6e` | ██████ | Splash / hero dark bg |
| 950 | `#082f49` | ██████ | Inline code bg, extreme dark |

---

## Neutral — Warm Gray (Stone)

| Step | Hex | Swatch | Usage |
|------|-----|--------|-------|
| 50 | `#fafaf9` | ██████ | Page background (light) |
| 100 | `#f5f5f4` | ██████ | Muted surface, secondary button bg |
| 200 | `#e7e5e4` | ██████ | Border default, input border |
| 300 | `#d6d3d1` | ██████ | Border strong, disabled text |
| 400 | `#a8a29e` | ██████ | Text muted (dark mode), placeholder |
| 500 | `#78716c` | ██████ | Text muted (light mode) |
| 600 | `#57534e` | ██████ | Text secondary |
| 700 | `#44403c` | ██████ | Heading text, emphasis |
| 800 | `#292524` | ██████ | Surface raised (dark mode) |
| 900 | `#1c1917` | ██████ | Text primary, card surface (dark) |
| 950 | `#0c0a09` | ██████ | Page background (dark) |

---

## Semantic Colors

### Success (Emerald Green)

| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#f0fdf4` | Success surface |
| 100 | `#dcfce7` | Success badge bg |
| 500 | `#22c55e` | Success main |
| 600 | `#16a34a` | Success hover |
| 700 | `#15803d` | Success text |

### Warning (Amber)

| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#fffbeb` | Warning surface |
| 100 | `#fef3c7` | Warning badge bg |
| 500 | `#f59e0b` | Warning main |
| 600 | `#d97706` | Warning hover |
| 700 | `#b45309` | Warning text |

### Danger (Rose)

| Step | Hex | Usage |
|------|-----|-------|
| 50 | `#fff1f2` | Danger surface |
| 100 | `#ffe4e6` | Danger badge bg |
| 500 | `#f43f5e` | Danger main |
| 600 | `#e11d48` | Danger hover |
| 700 | `#be123c` | Danger text |

---

## Semantic Role Mappings

| Role | Light | Dark | Contrast |
|------|-------|------|----------|
| `text-primary` | neutral-900 `#1c1917` | neutral-50 `#fafaf9` | **16.7:1** ✅ |
| `text-secondary` | neutral-600 `#57534e` | neutral-400 `#a8a29e` | **7.3:1** ✅ |
| `text-muted` | neutral-500 `#78716c` | `#78716c` | **4.6:1** ✅ |
| `text-inverse` | white `#ffffff` | neutral-900 `#1c1917` | — use on dark/brand bg only |
| `text-on-brand` | white `#ffffff` | neutral-950 `#0c0a09` | — use on brand bg only |
| `text-link` | brand-700 `#0369a1` | brand-400 `#38bdf8` | **5.7:1** ✅ |
| `surface-background` | neutral-50 `#fafaf9` | neutral-950 `#0c0a09` | — |
| `surface-card` | white `#ffffff` | neutral-900 `#1c1917` | — |
| `surface-raised` | neutral-100 `#f5f5f4` | neutral-800 `#292524` | — |
| `border-default` | neutral-200 `#e7e5e4` | neutral-800 `#292524` | — |
| `border-focus` | brand-500 `#0ea5e9` | brand-400 `#38bdf8` | — |

---

## Dark Mode

Dark mode activated via `.dark` class on `<html>`:

```css
:root { /* light */ }
.dark { /* dark overrides */ }
```

Key changes in dark mode:
- Backgrounds invert (light warm→dark warm)
- Primary color **lightens** from 500→400 for better visibility on dark
- Text colors invert
- Semantic colors shift to softer variants

---

## Usage Rules

1. **Never use raw hex values** — always reference a token
2. **Text on surface must meet WCAG AA** (4.5:1 body, 3:1 large)
3. **No information conveyed by color alone** — always pair with an icon or text label
4. **Brand primary** is for interactive elements (buttons, links, focus rings), not decoration
5. **Semantic colors** (success/warning/danger) are for status feedback only
