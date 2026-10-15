import type { LinkProps } from "@tanstack/react-router";

import { SearchField } from "@heroui/react";
import { Link } from "@tanstack/react-router";

import { ChevronRightIcon } from "@/components/icons";
import { BackButton } from "@/components/layout/top-bar-buttons";
import { Media } from "@/components/media";

export interface SearchResultRow {
  key: string;
  title: string;
  meta: string;
  photo?: string;
  link: LinkProps;
}

export interface SearchResultGroup {
  title: string;
  rows: SearchResultRow[];
}

interface GlobalSearchProps {
  label: string;
  placeholder: string;
  backLabel: string;
  query: string;
  onQueryChange: (q: string) => void;
  onBack: () => void;
  groups: SearchResultGroup[];
  noResults: string | null;
}

/**
 * Global search (UX proposal; search is not in the spec): opened from the 🔍 on the
 * discovery home. ← back and the field (focused on open), results grouped as compact rows.
 */
export function GlobalSearch({
  label,
  placeholder,
  backLabel,
  query,
  onQueryChange,
  onBack,
  groups,
  noResults,
}: GlobalSearchProps) {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-20 flex items-center gap-2 bg-background/90 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3 backdrop-blur-xl">
        <BackButton label={backLabel} onPress={onBack} />
        <SearchField
          // Native search screens open with the keyboard up.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          aria-label={label}
          className="flex-1"
          value={query}
          onChange={onQueryChange}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input className="w-full" placeholder={placeholder} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>

      <div className="flex flex-col gap-6 px-4 pt-2 pb-4">
        {noResults && (
          <p className="py-8 text-center text-sm text-muted">{noResults}</p>
        )}

        {groups.map((group) => (
          <section key={group.title} className="flex flex-col gap-1">
            <h2 className="pb-1 text-heading">{group.title}</h2>
            <ul className="flex flex-col">
              {group.rows.map((row) => (
                <li key={row.key}>
                  <Link
                    {...row.link}
                    className="flex items-center gap-3 rounded-2xl py-2 outline-none transition-transform focus-visible:focus-ring active:scale-[0.99]"
                  >
                    <Media
                      alt=""
                      className="size-14 shrink-0 rounded-xl"
                      photo={row.photo}
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-serif text-card-title">
                        {row.title}
                      </span>
                      <span className="truncate text-label text-muted">
                        {row.meta}
                      </span>
                    </span>
                    <ChevronRightIcon
                      className="shrink-0 text-muted"
                      size={18}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
