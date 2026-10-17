import type { Lang, PassId } from "../data/passes";

import { Button } from "@heroui/react";
import clsx from "clsx";
import { useId, useState } from "react";

import { PASS_INTEREST, PASS_ORDER } from "../data/passes";
import { ui } from "../lib/copy";

import { ArrowUpRightIcon, SelectedIcon } from "@/components/icons";
import { QuantityStepper } from "@/components/quantity-stepper";
import { useLocale } from "@/contexts/locale-context";

type Submit = (output: Record<string, unknown>) => void;

interface PickerProps {
  input: Record<string, unknown>;
  disabled: boolean;
  onSubmit: Submit;
}

const useLang = (): Lang => useLocale().language;

/**
 * Options sit on the guest's side as white cards with the app's surface shadow (no borders).
 * They fill one even grid, and a chosen one turns soft red with a ring, which is also a
 * shadow, so nothing shifts when it is picked.
 */
const optionBase =
  "animate-rise card-hover min-h-12 rounded-2xl bg-surface text-[15px] text-foreground shadow-surface outline-none transition-[background-color,box-shadow,scale] duration-150 focus-visible:focus-ring disabled:pointer-events-none disabled:text-muted motion-safe:active:scale-[0.98]";

const chosen =
  "bg-accent-soft text-accent-soft-foreground shadow-none ring-2 ring-accent hover:shadow-none";

const delay = (i = 0) =>
  ({ "--d": `${Math.min(i, 8) * 45}ms` }) as React.CSSProperties;

/** Options sit on the right, under the question, as one block of equal width. */
export function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const id = useId();

  return (
    <div className="ms-auto flex w-full max-w-[92%] flex-col gap-2">
      <span className="animate-rise self-end text-xs text-muted" id={id}>
        {label}
      </span>
      <div aria-labelledby={id} className="flex flex-col gap-2" role="group">
        {children}
      </div>
    </div>
  );
}

const Grid = ({
  cols,
  children,
}: {
  cols: 2 | 3 | 4;
  children: React.ReactNode;
}) => (
  <div
    className={clsx(
      "grid gap-2",
      cols === 4 && "grid-cols-4",
      cols === 3 && "grid-cols-3",
      cols === 2 && "grid-cols-2",
    )}
  >
    {children}
  </div>
);

/** A centred cell for a grid of choices. */
export function Chip({
  selected = false,
  hint,
  index = 0,
  className,
  children,
  ...props
}: {
  selected?: boolean;
  hint?: string;
  index?: number;
  children: React.ReactNode;
} & React.ComponentProps<"button">) {
  return (
    <button
      aria-pressed={selected || undefined}
      className={clsx(
        optionBase,
        "flex flex-col items-center justify-center gap-0.5 px-2 py-2.5 text-center font-medium tabular-nums",
        selected && chosen,
        className,
      )}
      style={delay(index)}
      type="button"
      {...props}
    >
      <span className="inline-flex items-center gap-1.5">
        {selected && (
          <SelectedIcon
            aria-hidden
            className="animate-pop size-4 shrink-0"
            weight="Filled"
          />
        )}
        {children}
      </span>
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </button>
  );
}

/** A full-width choice with a trailing arrow, for lists of unequal text. */
export function Row({
  hint,
  index = 0,
  children,
  ...props
}: {
  hint?: string;
  index?: number;
  children: React.ReactNode;
} & React.ComponentProps<"button">) {
  return (
    <button
      className={clsx(
        optionBase,
        "group flex w-full items-center gap-3 px-4 py-2.5 text-start",
      )}
      style={delay(index)}
      type="button"
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{children}</span>
        {hint && (
          <span className="line-clamp-1 text-sm text-muted">{hint}</span>
        )}
      </span>
      <ArrowUpRightIcon
        aria-hidden
        className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
      />
    </button>
  );
}

const Continue = ({
  disabled,
  onPress,
  children,
}: {
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) => (
  <Button
    fullWidth
    className="animate-rise min-h-12"
    isDisabled={disabled}
    size="lg"
    onPress={onPress}
  >
    {children}
  </Button>
);

export function RidePicker({ input, disabled, onSubmit }: PickerProps) {
  const t = ui[useLang()];
  const options = input.options as {
    id: string;
    label: string;
    hint: string;
  }[];

  return (
    <Group label={t.chooseOne}>
      {options.map((o, i) => (
        <Row
          key={o.id}
          disabled={disabled}
          hint={o.hint}
          index={i}
          onClick={() => onSubmit({ id: o.id, label: o.label })}
        >
          {o.label}
        </Row>
      ))}
    </Group>
  );
}

export function PartyPicker({ disabled, onSubmit }: PickerProps) {
  const t = ui[useLang()];
  const [riders, setRiders] = useState(2);
  const label = t.rider(riders);

  return (
    <Group label={t.setNumbers}>
      <div className="animate-rise flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-surface">
        <QuantityStepper
          label={t.riders}
          max={8}
          min={1}
          value={riders}
          onChange={setRiders}
        />
      </div>
      <Continue disabled={disabled} onPress={() => onSubmit({ riders, label })}>
        {t.continue} · {label}
      </Continue>
    </Group>
  );
}

export function DeparturePicker({ input, disabled, onSubmit }: PickerProps) {
  const t = ui[useLang()];
  const pass = input.pass as PassId;
  const options = input.options as {
    id: string;
    startsAt: string;
    label: string;
    hint: string;
  }[];

  return (
    <Group label={t.chooseOne}>
      {options.map((o, i) => (
        <Row
          key={o.id}
          disabled={disabled}
          hint={o.hint}
          index={i}
          onClick={() =>
            onSubmit({
              pass,
              departureId: o.id,
              startsAt: o.startsAt,
              label: o.label,
            })
          }
        >
          {o.label}
        </Row>
      ))}
    </Group>
  );
}

export function InterestsPicker({ disabled, onSubmit }: PickerProps) {
  const lang = useLang();
  const t = ui[lang];
  const [picked, setPicked] = useState<PassId[]>([]);
  const toggle = (id: PassId) =>
    setPicked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <Group label={t.chooseAny}>
      <Grid cols={2}>
        {PASS_ORDER.map((id, n) => (
          <Chip
            key={id}
            className={
              n === PASS_ORDER.length - 1 && PASS_ORDER.length % 2
                ? "col-span-2"
                : undefined
            }
            disabled={disabled}
            hint={PASS_INTEREST[id].theme}
            index={n}
            selected={picked.includes(id)}
            onClick={() => toggle(id)}
          >
            {PASS_INTEREST[id].label[lang]}
          </Chip>
        ))}
      </Grid>
      {picked.length > 0 && (
        <Continue
          disabled={disabled}
          onPress={() =>
            onSubmit({
              interests: picked,
              label: picked.map((p) => PASS_INTEREST[p].label[lang]).join(", "),
            })
          }
        >
          {t.continue} · {picked.length}
        </Continue>
      )}
    </Group>
  );
}

export function NextPicker({ input, disabled, onSubmit }: PickerProps) {
  const t = ui[useLang()];
  const options = input.options as {
    id: string;
    label: string;
    group: string;
  }[];
  const groups = [...new Set(options.map((o) => o.group))];

  return (
    <div className="flex flex-col gap-4">
      {groups.map((g) => (
        <Group key={g} label={g === "Adjust" ? t.adjust : t.nextStep}>
          {options
            .filter((o) => o.group === g)
            .map((o, n) => (
              <Row
                key={o.id}
                disabled={disabled}
                index={n}
                onClick={() => onSubmit({ id: o.id, label: o.label })}
              >
                {o.label}
              </Row>
            ))}
        </Group>
      ))}
    </div>
  );
}
