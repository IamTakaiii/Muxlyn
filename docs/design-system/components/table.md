# Table

## Purpose
Display structured data in rows and columns. Sortable, selectable, responsive.

## Anatomy
- **Table wrapper** — horizontal scroll container
- **Table head** — `<thead>` with sticky header
- **Header cells** — sortable, right/left aligned
- **Table body** — `<tbody>` with row dividers
- **Data cells** — content cells
- **Empty state** — inline message when no data
- **Pagination** (optional) — footer with page controls

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Standard data table with borders |
| `striped` | Alternating row colors |
| `compact` | Dense rows for data-heavy views |

## Sizes

| Size | Cell PY | Cell PX | Font |
|------|---------|---------|------|
| `sm` | 8px | 12px | `text-sm` |
| `md` | 12px | 16px | `text-sm` |
| `lg` | 16px | 16px | `text-base` |

## States

| State | Row styling |
|-------|-------------|
| **Default** | `bg-background` |
| **Hover** | `bg-muted/50` |
| **Selected** | `bg-primary/5 border-l-2 border-l-primary` |
| **Sorted column** | Header icon + bold text |
| **Loading** | Skeleton rows (5 rows, each row 3-5 skeleton cells) |
| **Empty** | Centered message with icon + "No results" text |

## Cell Alignment

| Content | Alignment |
|---------|-----------|
| Text, strings | Left |
| Numbers, amounts | Right |
| Dates, timestamps | Left (or right if sort key) |
| Actions, checkboxes | Center |
| Status badges | Left |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--border` | Cell dividers |
| `--muted` | Header bg, hover bg |
| `--background` | Row bg |
| `--foreground` | Text |
| `--primary` | Selected indicator, sort icon |
| `--radius-none` (0px) | Table corners |

## Accessibility
- Role: `table` (use `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`)
- `<caption>` for table title (optional but recommended)
- `scope="col"` on header cells, `scope="row"` on row headers
- Sortable headers: `<button>` inside `<th>`, `aria-sort="ascending|descending|none"`
- Sticky header for long tables

## Do / Don't
- **Do**: Right-align numeric columns
- **Do**: Provide column sorting for > 10 rows
- **Do**: Use horizontal scroll below 768px instead of collapsing columns
- **Don't**: Use nested tables
- **Don't**: Make cells too narrow — minimum 80px per column
- **Don't**: Hide the header — always keep `<thead>` visible

## Code Example

```tsx
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-primary/5",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
```
