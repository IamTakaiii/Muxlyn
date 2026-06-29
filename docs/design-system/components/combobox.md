# Combobox

## Purpose
Searchable select — user can type to filter options. Combines Input + Select behavior.

## Anatomy
- **Trigger** — Input with chevron icon
- **Dropdown** — Command palette-style popover
- **Search input** — at top of dropdown
- **Option list** — scrollable, filtered results
- **Empty state** — "No results found"

## Variants

| Variant | Usage |
|---------|-------|
| `default` | Searchable, allows freeform input + selection |
| `select-only` | Must choose from options, no freeform |

## States

| State | Behavior |
|-------|----------|
| **Default** | Input with placeholder, chevron |
| **Open** | Dropdown visible, first option highlighted |
| **Typing** | Options filter in real-time |
| **No results** | Empty state message |
| **Selected** | Value shown in input |
| **Disabled** | `opacity-50 cursor-not-allowed` |
| **Loading** | Spinner in dropdown while fetching options |

## Tokens Used

| Token | Usage |
|-------|-------|
| `--input` | Trigger border |
| `--ring` | Focus ring |
| `--popover` (card) | Dropdown bg |
| `--shadow-md` | Dropdown shadow |
| `--radius-md` | Trigger + dropdown |

## Accessibility
- Role: `combobox`
- `aria-expanded` on input
- `aria-autocomplete="list"`
- `aria-activedescendant` for active option
- `ArrowUp/Down` to navigate, `Enter` to select, `Escape` to close
- Announce number of results to screen reader

## Do / Don't
- **Do**: Debounce search input by 200ms for server-side filtering
- **Do**: Show loading spinner for async options
- **Do**: Allow keyboard-only selection
- **Don't**: Use Combobox for < 5 static options — use Select
- **Don't**: Open dropdown on focus without user interaction

## Code Example

```tsx
import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value
            ? options.find((o) => o.value === value)?.label
            : placeholder}
          <ChevronsUpDown size={16} className="ml-2 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange?.(option.value === value ? "" : option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    size={16}
                    className={cn(
                      "mr-2",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
```
