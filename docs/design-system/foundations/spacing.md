# Spacing

**Base**: 4px grid

---

## Scale

| Token | Value | px | Tailwind |
|-------|-------|----|----------|
| `0` | 0px | 0 | `0` |
| `1` | 4px | 4 | `1` |
| `2` | 8px | 8 | `2` |
| `3` | 12px | 12 | `3` |
| `4` | 16px | 16 | `4` |
| `5` | 20px | 20 | `5` |
| `6` | 24px | 24 | `6` |
| `8` | 32px | 32 | `8` |
| `10` | 40px | 40 | `10` |
| `12` | 48px | 48 | `12` |
| `16` | 64px | 64 | `16` |
| `20` | 80px | 80 | `20` |
| `24` | 96px | 96 | `24` |
| `32` | 128px | 128 | `32` |

---

## Usage Map

| Range | Use Case |
|-------|----------|
| `0–2` (0–8px) | Icon padding, inline gaps, badge px, chip inner |
| `3–4` (12–16px) | Button px, input px, form field gaps, list item gaps |
| `5–6` (20–24px) | Card padding, section header gaps, modal px |
| `8–10` (32–40px) | Section spacing, dialog py |
| `12–16` (48–64px) | Page section gaps, hero padding |
| `20–32` (80–128px) | Page-level margins, layout containers |

---

## Component Presets

| Component | Padding X | Padding Y | Gap |
|-----------|-----------|-----------|-----|
| Button sm | `3` (12px) | `2` (8px) | — |
| Button md | `4` (16px) | `2` (8px) | — |
| Button lg | `6` (24px) | `3` (12px) | — |
| Input sm | `3` (12px) | `2` (8px) | — |
| Input md | `3` (12px) | `2` (8px) | — |
| Card | `6` (24px) | `6` (24px) | `4` (16px) header-body |
| Modal | `6` (24px) | `6` (24px) | `5` (20px) header-body-footer |
| Form fields | — | — | `5` (20px) |
| Table cell | `4` (16px) | `3` (12px) | — |
| Section | — | `8` (32px) | — |

---

## Usage Rules

1. **4px baseline** — ทุกค่า spacing ต้องหาร 4 ลงตัว
2. **Py < Px** — vertical padding ควรน้อยกว่า horizontal (ยกเว้น card)
3. **No magic numbers** — ใช้เฉพาะ token เสมอ
4. **Gap over margin** — ใช้ `gap` ใน flex/grid แทน `margin` บน children
5. **Container max-width** — content max-width ใช้ `1280px` (5xl)
