# Syncing with upstream (Swiss Keepsakes)

This repo is a long-lived fork of `swiss-keepsakes`. Upstream is the git remote `upstream`
(push disabled). We merge from it; we never rebase and never push to it.

| | |
|---|---|
| Fork point | `c7850da` (upstream, 14 Oct 2026) |
| Last synced | `6049868` (upstream `main`: merchant calendar, tour editor layout) |
| Synced on | 16 Oct 2026, tag `upstream-synced-6049868` |

## Every sync

```bash
git fetch upstream
git switch -c sync/upstream-<short-sha>
git merge upstream/main --no-commit --no-ff
scripts/post-sync-prune.sh          # drops files for features we do not ship
# resolve what is left (rules below), then:
cd front-end && npx tsc --noEmit && npx eslint src --fix && npx vite build
# check the app (dashboard: /store, /store/sales, /store/bookings, /store/products; guest: /tours)
git commit && git switch main && git merge --ff-only sync/upstream-<short-sha>
git tag upstream-synced-<short-sha>
```

`git config rerere.enabled true` is set, so a conflict resolved once is resolved the same way
next time.

## Rules for conflicts

- **Ours wins** for product decisions: brand and logo, home page and its sections
  (`features/discovery/**`), sign-in, the signed-in profile (Erich Haldi), demo data
  (`features/demo/**`), tour seed, tour reviews, notifications, requests mail, catalog types
  and seed, photo credits (`CREDITS.txt`).
- **Theirs first, then re-apply our removals** for dashboard feature code
  (`features/merchant/**`, shared dashboard components, tours dashboard pages, tour list
  page). Re-apply: no commission, no keepsake or order code, the host as the only role.
  The typechecker lists what is left.
- **Deleted by us, changed by them**: keep it deleted. Port only changes to shared pieces
  that we moved (e.g. `SheetFrame` now lives in `components/sheet-frame.tsx`).
- **Message files** (`i18n/en.ts`, `de.ts`, `*/messages.ts`): keep our keys, add the keys that
  only upstream has, then delete the ones nothing uses. English and German must match.
- Never take upstream's tour data: our tours are the five moto pass tours.
- **Dashboard sidebar** (`components/layout/merchant-shell.tsx`): follow upstream's structure,
  order and labels (groups that fold open, "Dashboard", "Operations", the phone bar), but list
  only our sections. Do not add upstream items for features we do not ship.
- **Guest departure picker**: ours is `features/tours/discovery/listing-picker` (tours, stays and
  experiences). Upstream's `departure-picker` is a port of it without stays; it is pruned.

## Not shipped (removed on purpose)

Keepsake shop (gifts, cart, checkout, orders, pickup points, categories), partners and
referral (`/partner`, `/r/$code`, commission), local stories and content, reports and costs,
trip advice, the manager and partner roles, the dashboard Requests section, the lab pages,
upstream's 11 Lucerne tours (`features/tours/lucerne`) and their photos. Our own design lab
(`features/lab/brand`, `routes/_guest/lab.*`) is kept; the prune script removes only upstream's.

## Sync log

- **6049868** (16 Oct 2026): took the merchant Calendar (day, week and month on FullCalendar,
  `@fullcalendar/react` and `temporal-polyfill`), adapted to our listings: tour departures as
  timed events, experience starts as 30-minute events, stay nights in the all-day row; keepsake
  pickups dropped. Took the tour editor's new layout (timeline step list, phone step bar, growing
  text fields, map-linked itinerary with place search and drag reorder) and kept our grouped
  experience departures in it. Sidebar re-ordered to upstream's pattern: Dashboard (Today,
  Sales), Operations (Bookings, Calendar), Products, Settings; phones: Dashboard, Bookings,
  Calendar, Products, More. Skipped: the commission stepper and gift editor changes, the
  Inquiries tab change, the lab calendar, upstream's port of our departure picker.

- **391b282** (15 Oct 2026): took the aerial tour route map (swisstopo SWISSIMAGE photo with
  terrain, labels on top, tiles of the next stop loaded before the camera flies there). Dropped
  its lab pages (`routes/lab.map*.tsx`, `features/lab`).

- **81d5843** (15 Oct 2026): took the dashboard shell (sidebar with brand block and profile,
  `RouteTabs`, `RowActions`, `FilterBar`, skeletons, sheet exit animation), the products
  pages split into Tours, Stays and Experiences, and the Sales all-time row (tours only, with
  a shared `Donut`). Kept our five tours. Dropped about 95 upstream files for features we do
  not ship. Upstream committed two stray notes files, `features/Brienz` and
  `features/Lucerne`; they are pruned.
