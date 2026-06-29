# Shadows (Elevation)

---

## Light Mode

| Token | Value | Elevation | Usage |
|-------|-------|-----------|-------|
| `xs` | `0 1px 2px rgba(0,0,0,0.05)` | 1 | Subtle lift — hover state on cards |
| `sm` | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)` | 2 | Dropdowns, tooltips, popovers |
| `md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)` | 3 | Cards (hover), sticky headers |
| `lg` | `0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)` | 4 | Modals, dialogs |
| `xl` | `0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04)` | 5 | Command palette, top-level dialogs |
| `2xl` | `0 25px 50px rgba(0,0,0,0.15)` | 6 | Full-screen takeover, onboarding |

---

## Dark Mode

Dark mode shadows use **colored glow** instead of pure black — black shadows are invisible on dark backgrounds.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `0 1px 2px rgba(0,0,0,0.25)` | Hover cards |
| `sm` | `0 0 0 1px rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.3)` | Dropdowns, tooltips |
| `md` | `0 0 0 1px rgba(255,255,255,0.08), 0 4px 6px rgba(0,0,0,0.3)` | Cards, sticky headers |
| `lg` | `0 0 0 1px rgba(255,255,255,0.08), 0 10px 15px rgba(0,0,0,0.4)` | Modals |
| `xl` | `0 0 0 1px rgba(255,255,255,0.1), 0 20px 25px rgba(0,0,0,0.5)` | Command palette |
| `2xl` | `0 0 0 1px rgba(255,255,255,0.12), 0 25px 50px rgba(0,0,0,0.6)` | Full takeover |

---

## Tailwind Mapping

```js
boxShadow: {
  xs:   '0 1px 2px rgba(0,0,0,0.05)',
  sm:   '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  md:   '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
  lg:   '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)',
  xl:   '0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04)',
  '2xl':'0 25px 50px rgba(0,0,0,0.15)',
  'dark-xs': '0 1px 2px rgba(0,0,0,0.25)',
  'dark-sm': '0 0 0 1px rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.3)',
  'dark-md': '0 0 0 1px rgba(255,255,255,0.08), 0 4px 6px rgba(0,0,0,0.3)',
  // ... etc
},
```

---

## Usage Rules

1. **Alpha-only blacks** — never use opaque black for shadows
2. **Elevation conveys hierarchy** — higher z-index = larger shadow
3. **Dark mode gets glow borders** — `0 0 0 1px rgba(255,255,255,0.06)` กัน element กลืนกับพื้น
4. **Max 2 shadows per element** — combine 2 shadow values at most
5. **No shadows on flat layouts** — don't shadow everything; reserve for overlay/raised surfaces
