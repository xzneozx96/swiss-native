import { Button, Dropdown, Label } from "@heroui/react";

import { ChevronDownIcon, CloseIcon, FilterIcon } from "@/components/icons";
import { useLocale } from "@/contexts/locale-context";

export interface FilterOption<Id extends string> {
  id: Id;
  label: string;
  count: number;
}

/** The chosen options' labels, or the "all" wording when nothing is chosen. */
export function selectedLabels<Id extends string>(
  options: FilterOption<Id>[],
  selected: Id[],
  allLabel: string,
) {
  return selected.length
    ? options
        .filter((o) => selected.includes(o.id))
        .map((o) => o.label)
        .join(", ")
    : allLabel;
}

/**
 * Filter of a merchant list: one button that opens a menu of options with counts, any number
 * of them ticked, and the ticked ones as chips beside it that each clear with a tap.
 * Nothing ticked means no filter.
 */
export function MerchantFilter<Id extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FilterOption<Id>[];
  selected: Id[];
  onChange: (selected: Id[]) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Dropdown>
        <Button size="sm" variant="tertiary">
          <FilterIcon aria-hidden className="shrink-0" size={16} />
          {label}
          <ChevronDownIcon aria-hidden className="shrink-0" size={16} />
        </Button>
        <Dropdown.Popover placement="bottom start">
          <Dropdown.Menu
            aria-label={label}
            selectedKeys={new Set(selected)}
            selectionMode="multiple"
            onSelectionChange={(keys) =>
              onChange(
                keys === "all"
                  ? options.map((o) => o.id)
                  : (options
                      .map((o) => o.id)
                      .filter((id) => keys.has(id)) as Id[]),
              )
            }
          >
            {options.map((o) => (
              <Dropdown.Item key={o.id} id={o.id} textValue={o.label}>
                <Label className="flex-1">{o.label}</Label>
                <span className="text-sm text-muted tabular-nums">
                  {o.count}
                </span>
                <Dropdown.ItemIndicator />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      {options
        .filter((o) => selected.includes(o.id))
        .map((o) => (
          <Button
            key={o.id}
            size="sm"
            variant="secondary"
            onPress={() => onChange(selected.filter((id) => id !== o.id))}
          >
            {o.label}
            <CloseIcon
              aria-label={t("reports.filter.remove", { filter: o.label })}
              size={14}
            />
          </Button>
        ))}
    </div>
  );
}
