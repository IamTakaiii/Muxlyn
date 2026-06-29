# Border Radius

---

## Scale

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0px | Tables, dividers, code blocks |
| `sm` | 4px | Badges, tags, checkboxes, small chips |
| `md` | 8px | Buttons, inputs, selects, dropdowns **(default)** |
| `lg` | 12px | Cards, panels, dialogs |
| `xl` | 16px | Modals, large dialogs, sheets |
| `2xl` | 24px | Hero panels, feature cards |
| `full` | 9999px | Pills, avatars, toggle switches |

---

## Tailwind Mapping

```js
borderRadius: {
  none: '0px',
  sm:   '4px',
  md:   '8px',     // DEFAULT
  lg:   '12px',
  xl:   '16px',
  '2xl':'24px',
  full: '9999px',
},
```

---

## Component Defaults

| Component | Radius | Token |
|-----------|--------|-------|
| Button | 8px | `md` |
| Input / Textarea / Select | 8px | `md` |
| Card | 12px | `lg` |
| Modal / Dialog | 16px | `xl` |
| Toast | 12px | `lg` |
| Badge / Tag | 9999px | `full` |
| Avatar | 9999px | `full` |
| Tooltip | 8px | `md` |
| Dropdown Menu | 8px | `md` |
| Table | 0px | `none` |
| Progress bar | 9999px | `full` |
| Switch | 9999px | `full` |
| Sheet (Drawer) | 16px (top only) | `xl` |

---

## Usage Rules

1. **Nested radii** — inner element radius = parent radius - 4px; ถ้า parent เป็น container ที่มี padding มากพอไม่ต้องปรับ
2. **Md is the default** — 8px ใช้กับทุก interactive element เล็ก ๆ
3. **Full for circular** — ใช้ `full` แทนการคำนวน 50% เพื่อให้ได้ pill/circle จริง
4. **Consistency** — interactive elements ในกลุ่มเดียวกันต้องใช้ radius เท่ากัน
5. **No mixed radii** — อย่าใช้ radius หลายค่าใน component เดียวกัน (except table)
