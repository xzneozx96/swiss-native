import type { CSSProperties } from "react";
import type { Plan } from "../lib/plan";

import { Chip } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

import { ui } from "../lib/copy";

import { useLocale } from "@/contexts/locale-context";

const COLS = "grid grid-cols-[2.75rem_1rem_minmax(0,1fr)] gap-x-3";
const rise = (n: number) =>
  ({ "--d": `${Math.min(n, 10) * 55}ms` }) as CSSProperties;

/** The itinerary the build_itinerary tool returned, as a timeline: day, rail, what the day holds. */
export function ItineraryCard({ plan }: { plan: Plan }) {
  const { language } = useLocale();
  const t = ui[language];
  const isNew = (name: string) => plan.added.includes(name);

  return (
    <article className="animate-rise w-full overflow-hidden rounded-3xl bg-surface shadow-surface">
      <header className="flex flex-col gap-1 px-5 pt-4 pb-3">
        <h3 className="font-serif text-title">{plan.title}</h3>
        <p className="text-sm text-muted">
          {t.summary(plan.days, plan.passes.length, plan.price)}
        </p>
      </header>

      <ol className="px-5 pb-4">
        {plan.items.map((item, n) => (
          <li
            key={item.id}
            className={clsx(COLS, "animate-rise")}
            style={rise(n)}
          >
            <span className="pt-px text-sm font-semibold tabular-nums">
              {t.day} {item.day}
            </span>
            <div className="relative flex flex-col items-center">
              <span
                aria-hidden
                className="mt-1.5 size-3 shrink-0 rounded-full bg-accent ring-4 ring-surface"
              />
              {n !== plan.items.length - 1 && (
                <span aria-hidden className="w-px flex-1 bg-separator" />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1 pb-3">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h4 className="font-serif text-body leading-snug font-semibold">
                  {item.name}
                </h4>
                {isNew(item.name) && (
                  <Chip color="success" size="sm" variant="soft">
                    <Chip.Label>{t.isNew}</Chip.Label>
                  </Chip>
                )}
                {item.tag && (
                  <Chip size="sm" variant="secondary">
                    <Chip.Label>{item.tag}</Chip.Label>
                  </Chip>
                )}
              </div>
              <p className="text-sm leading-snug text-muted">{item.text}</p>
              {item.pass && (
                <Link
                  className="w-fit text-xs text-muted underline underline-offset-2"
                  params={{ pass: item.pass }}
                  to="/passes/$pass"
                >
                  {language === "de" ? "Geschichte lesen" : "Read the story"}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>

      {(plan.notes.length > 0 ||
        plan.removed.length > 0 ||
        plan.skipped.length > 0) && (
        <footer className="flex flex-col gap-3 border-t border-separator bg-surface-secondary/50 px-5 py-4 text-sm">
          {plan.removed.length > 0 && (
            <p>
              <span className="font-medium">{t.removed}</span>{" "}
              <span className="text-muted line-through">
                {plan.removed.join(", ")}
              </span>
            </p>
          )}
          {plan.notes.length > 0 && (
            <div>
              <p className="font-medium">{t.goodToKnow}</p>
              <ul className="list-disc ps-5 text-muted">
                {plan.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
          {plan.skipped.length > 0 && (
            <div>
              <p className="font-medium">{t.leftOut}</p>
              <ul className="list-disc ps-5 text-muted">
                {plan.skipped.map((s) => (
                  <li key={s.name}>
                    {s.name}: {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}
