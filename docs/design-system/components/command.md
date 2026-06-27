# Command (⌘K)

## Purpose
Keyboard-first command palette. ⌘K to open, search, and execute actions.

## Anatomy
- **Overlay** — semi-transparent backdrop
- **Dialog** — centered modal with search input + results list
- **Search input** — auto-focused, with magnifying glass icon
- **Result groups** — labeled sections (e.g., "Pages", "Actions", "Recent")
- **Result items** — icon + title + optional shortcut
- **Empty state** — "No results found"

## States

| State | Behavior |
|-------|----------|
| **Closed** | Not rendered |
| **Opening** | Modal enter animation |
| **Idle** | Search input focused, recent items shown |
| **Searching** | Results filter reactively on keystroke |
| **Navigating** | Arrow keys move highlight |
| **Executing** | Item selected, palette closes |
| **No results** | Empty state shown |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--background` | Dialog bg |
| `--foreground` | Text |
| `--muted-foreground` | Group labels, shortcuts |
| `--accent` | Selected item bg |
| `--shadow-xl` | Dialog elevation |
| `--radius-lg` (12px) | Dialog corners |
| `surface-overlay` | Backdrop |

## Keyboard

| Key | Action |
|-----|--------|
| `⌘K` | Toggle open/close |
| `Escape` | Close |
| `ArrowDown/Up` | Navigate items |
| `Enter` | Execute selected item |
| `Tab` | Focus next section |

## Accessibility
- Role: `dialog` with `aria-label="Command palette"` or `aria-labelledby`
- `role="combobox"` on search input
- `role="listbox"` on results container
- `role="option"` on each result item
- Focus trapped inside dialog
- Screen reader announces result count

## Do / Don't
- **Do**: Group results logically (Pages, Actions, Recent, Settings)
- **Do**: Show keyboard shortcuts right-aligned
- **Do**: Debounce search to avoid jank (not needed for local filtering)
- **Do**: Prioritize exact matches, then fuzzy
- **Don't**: Show > 20 results without grouping/scrolling
- **Don't**: Show the palette on page load — only on ⌘K

## Code Example

```tsx
import { useEffect, useState, useCallback } from "react";
import { Calculator, Calendar, Search, Smile, User } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group: string;
  onSelect: () => void;
}

function CommandPalette({ items }: { items: CommandItem[] }) {
  const [open, setOpen] = useState(false);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const groups = [...new Set(items.map((i) => i.group))];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group} heading={group}>
            {items
              .filter((item) => item.group === group)
              .map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    item.onSelect();
                    setOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export { CommandPalette };
```
