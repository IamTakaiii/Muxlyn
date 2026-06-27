# Muxlyn Design System

**Theme**: Soft Sky Blue + Warm Gray · **Mood**: สบายตา มืออาชีพ modern
**Stack**: React 19 + Tailwind CSS v3 + shadcn/ui

> Design tokens are the **source of truth**. Every component, every page references tokens — never raw values.

---

## Getting Started

### 1. Install dependencies

```bash
bun add lucide-react class-variance-authority clsx tailwind-merge
```

### 2. Update `globals.css`

Replace your existing `globals.css` with [`tokens/globals.css`](tokens/globals.css).

### 3. Extend Tailwind config

Add token extensions to your `tailwind.config.*`:

```js
// tailwind.config.ts
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      fontSize: {
        "display-2xl": ["72px", { lineHeight: "1.15", fontWeight: 700 }],
        "display-xl":  ["60px", { lineHeight: "1.15", fontWeight: 700 }],
        "display-lg":  ["48px", { lineHeight: "1.15", fontWeight: 700 }],
        "heading-xl":  ["36px", { lineHeight: "1.2",  fontWeight: 600 }],
        "heading-lg":  ["30px", { lineHeight: "1.25", fontWeight: 600 }],
        "heading-md":  ["24px", { lineHeight: "1.3",  fontWeight: 600 }],
        "heading-sm":  ["20px", { lineHeight: "1.4",  fontWeight: 600 }],
        "body-lg":     ["18px", { lineHeight: "1.55", fontWeight: 400 }],
        "body-md":     ["16px", { lineHeight: "1.5",  fontWeight: 400 }],
        "body-sm":     ["14px", { lineHeight: "1.5",  fontWeight: 400 }],
        "caption":     ["12px", { lineHeight: "1.4",  fontWeight: 500 }],
        "mono-md":     ["14px", { lineHeight: "1.5",  fontWeight: 400 }],
      },
      borderRadius: {
        none: "0px",
        sm:   "4px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        "2xl":"24px",
        full: "9999px",
      },
      boxShadow: {
        xs:   "0 1px 2px rgba(0,0,0,0.05)",
        sm:   "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        md:   "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
        lg:   "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)",
        xl:   "0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04)",
        "2xl":"0 25px 50px rgba(0,0,0,0.15)",
      },
      transitionDuration: {
        instant: "0ms",
        fast:    "120ms",
        base:    "200ms",
        slow:    "320ms",
        slower:  "500ms",
      },
      transitionTimingFunction: {
        standard:   "cubic-bezier(0.2, 0, 0, 1)",
        emphasized: "cubic-bezier(0.3, 0, 0, 1)",
        out:        "cubic-bezier(0, 0, 0.2, 1)",
        in:         "cubic-bezier(0.4, 0, 1, 1)",
      },
    },
  },
};
```

### 4. Import and use components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
```

---

## Structure

```
design-system/
├── README.md                  ← You are here
├── accessibility.md           ← WCAG targets, focus rules, contrast report
├── foundations/
│   ├── colors.md              ← Full palette, semantic roles, light+dark
│   ├── typography.md          ← Type scale, families, weights
│   ├── spacing.md             ← 4px grid, component presets
│   ├── radius.md              ← Border radius scale + defaults
│   ├── shadows.md             ← Elevation tiers, light+dark
│   ├── motion.md              ← Easing, durations, reduced motion
│   └── iconography.md         ← Lucide icons, sizing, color mapping
├── components/                ← Component specs (anatomy, states, a11y)
│   ├── button.md
│   ├── input.md
│   └── ...
└── tokens/
    ├── tokens.json            ← W3C Design Tokens (canonical)
    ├── tokens.css             ← CSS custom properties
    └── globals.css            ← shadcn/ui-ready (HSL format)
```

---

## Principles

1. **Tokens are the source of truth** — components reference tokens, never raw `#hex` or `px`
2. **Light + dark from the start** — every color pair works in both modes
3. **Accessibility is non-negotiable** — WCAG AA minimum (4.5:1 body, 3:1 large)
4. **Match the project** — extend existing patterns, don't impose
5. **Document the why** — each foundation explains usage rules, not just values

---

## Adding a New Component

1. Read the relevant component spec in `components/`
2. Implement using `class-variance-authority` for variant APIs
3. Reference CSS custom properties or Tailwind semantic classes
4. Never hardcode hex values or pixel sizes
5. Test with light + dark mode
