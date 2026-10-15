import type { EmptyStateProps } from "@/components/empty-state";
import type { ReactNode } from "react";

import { Table } from "@heroui/react";

import { EmptyState, TableEmptyState } from "@/components/empty-state";
import { Pager, usePaged } from "@/components/list-pagination";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  isRowHeader?: boolean;
  /** Width or alignment of the column, e.g. "w-[36%]" or "text-end". */
  headerClassName?: string;
  cellClassName?: string | ((row: T) => string);
}

interface DataTableProps<T> {
  /** Accessible name of the table: the selected tab or filter. */
  label: string;
  columns: DataTableColumn<T>[];
  /** Every row; the table cuts them into pages of 10. */
  rows: T[];
  getRowId: (row: T) => string;
  /** Makes the whole row a link. */
  getRowHref?: (row: T) => string;
  /** Back to page 1 when this changes, e.g. on a new tab, filter or search. */
  resetKey?: string;
  /**
   * Phones: the card list for one page of rows. Without it the table shows at every width;
   * with it the table shows from 1024px and the same pager sits under the cards.
   */
  cards?: (pageRows: T[]) => ReactNode;
  /** Shown inside the table when `rows` is empty, and as a card on phones. */
  empty?: EmptyStateProps;
  /**
   * Where the table sits. "page" (default) puts it on its own white card; "card" is for a table
   * already inside a card or widget. Both draw the same plain rows (owner review 15.10.2026).
   */
  variant?: "page" | "card";
  className?: string;
  /** Classes for the table element itself, e.g. "table-fixed". */
  contentClassName?: string;
}

/**
 * The one table of the app: HeroUI Table with its own empty state and the pager in its
 * footer. Callers describe the columns; the markup, empty state and paging live here.
 */
export function DataTable<T>({
  label,
  columns,
  rows,
  getRowId,
  getRowHref,
  resetKey,
  cards,
  empty,
  variant,
  className,
  contentClassName,
}: DataTableProps<T>) {
  const { pageItems, pager } = usePaged(rows, resetKey);
  const isOnPage = variant !== "card";
  const tableClass = [
    cards && "hidden lg:block",
    // On the page the table gets its own white card; the rows inside stay plain.
    isOnPage && "rounded-3xl bg-surface p-2 shadow-surface",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {cards && (
        <>
          {empty && !rows.length && (
            <div className="lg:hidden">
              <EmptyState {...empty} />
            </div>
          )}
          {cards(pageItems)}
          <div className="lg:hidden">
            <Pager compact pager={pager} />
          </div>
        </>
      )}
      {/* One look everywhere: HeroUI's plain rows (secondary), small muted headers, dividers. */}
      <Table className={tableClass || undefined} variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label={label} className={contentClassName}>
            <Table.Header>
              {columns.map((column) => (
                <Table.Column
                  key={column.id}
                  className={column.headerClassName}
                  isRowHeader={column.isRowHeader}
                >
                  {column.header}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body
              renderEmptyState={empty && (() => <TableEmptyState {...empty} />)}
            >
              {pageItems.map((row) => (
                <Table.Row
                  key={getRowId(row)}
                  className={getRowHref ? "cursor-pointer" : undefined}
                  href={getRowHref?.(row)}
                >
                  {columns.map((column) => (
                    <Table.Cell
                      key={column.id}
                      className={
                        typeof column.cellClassName === "function"
                          ? column.cellClassName(row)
                          : column.cellClassName
                      }
                    >
                      {column.render(row)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
        {pager.pages > 1 && (
          <Table.Footer>
            <Pager pager={pager} />
          </Table.Footer>
        )}
      </Table>
    </>
  );
}
