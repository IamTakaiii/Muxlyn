# Typography

**Fonts**: Inter (sans-serif) + JetBrains Mono (monospace)
**Scale**: Modular 1.25 (Major Third)

---

## Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `font-sans` | Inter, ui-sans-serif, system-ui, -apple-system, sans-serif | Body, headings, UI |
| `font-mono` | JetBrains Mono, ui-monospace, SFMono-Regular, monospace | Code, timestamps, IDs, Jira keys |

---

## Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display-2xl` | 72px | 1.15 | 700 | Hero titles, landing |
| `display-xl` | 60px | 1.15 | 700 | Section heroes |
| `display-lg` | 48px | 1.15 | 700 | Page titles |
| `heading-xl` | 36px | 1.2 | 600 | H1 |
| `heading-lg` | 30px | 1.25 | 600 | H2 |
| `heading-md` | 24px | 1.3 | 600 | H3 |
| `heading-sm` | 20px | 1.4 | 600 | H4, card titles |
| `body-lg` | 18px | 1.55 | 400 | Lead paragraphs |
| `body-md` | 16px | 1.5 | 400 | Default body text |
| `body-sm` | 14px | 1.5 | 400 | Secondary text, descriptions |
| `caption` | 12px | 1.4 | 500 | Labels, captions, metadata |
| `mono-md` | 14px | 1.5 | 400 | Code blocks, inline code |

---

## Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `regular` | 400 | Body text, labels |
| `medium` | 500 | Captions, button labels, nav items |
| `semibold` | 600 | Headings, emphasized text |
| `bold` | 700 | Hero text, strong emphasis |

---

## Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | 1.15 | Display text, hero |
| `snug` | 1.3 | Headings |
| `normal` | 1.5 | Body text (default) |
| `relaxed` | 1.625 | Long-form reading |

---

## Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | -0.02em | Display text |
| `normal` | 0 | All body and UI text |
| `wide` | 0.02em | Uppercase labels, badges |

---

## Tailwind Configuration

```js
// tailwind.config.extension.js
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
},
fontSize: {
  'display-2xl': ['72px', { lineHeight: '1.15', fontWeight: 700 }],
  'display-xl':  ['60px', { lineHeight: '1.15', fontWeight: 700 }],
  'display-lg':  ['48px', { lineHeight: '1.15', fontWeight: 700 }],
  'heading-xl':  ['36px', { lineHeight: '1.2',  fontWeight: 600 }],
  'heading-lg':  ['30px', { lineHeight: '1.25', fontWeight: 600 }],
  'heading-md':  ['24px', { lineHeight: '1.3',  fontWeight: 600 }],
  'heading-sm':  ['20px', { lineHeight: '1.4',  fontWeight: 600 }],
  'body-lg':     ['18px', { lineHeight: '1.55', fontWeight: 400 }],
  'body-md':     ['16px', { lineHeight: '1.5',  fontWeight: 400 }],
  'body-sm':     ['14px', { lineHeight: '1.5',  fontWeight: 400 }],
  'caption':     ['12px', { lineHeight: '1.4',  fontWeight: 500 }],
  'mono-md':     ['14px', { lineHeight: '1.5',  fontWeight: 400 }],
},
```

---

## Usage Rules

1. **One heading per section** — don't skip hierarchy levels
2. **Body-md is the default** — ใช้ในทุก content ทั่วไป
3. **Mono for technical content** — Jira keys (e.g. `PROJ-123`), timestamps, commit hashes
4. **Captions are 500 weight** — ให้เด่นขึ้นจาก body-sm ตอนใช้เป็น label
5. **Truncation** — single-line truncation at 320px+ for long text in tables
