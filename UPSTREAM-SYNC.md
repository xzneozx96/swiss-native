# Syncing with upstream (Swiss Keepsakes)

This repo is a long-lived fork of `swiss-keepsakes`. Upstream is the git remote `upstream`
(push disabled). We merge from it; we never rebase and never push to it.

| | |
|---|---|
| Fork point | `c7850da` (upstream, 14 Oct 2026) |
| Last synced | `81d5843` (upstream `main`, merge of PR #1: Lucerne tours and dashboards) |
| Synced on | 15 Oct 2026, tag `upstream-synced-81d5843` |

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

## Not shipped (removed on purpose)

Keepsake shop (gifts, cart, checkout, orders, pickup points, categories), partners and
referral (`/partner`, `/r/$code`, commission), local stories and content, reports and costs,
trip advice, the manager and partner roles, the dashboard Requests section, the lab pages,
upstream's 11 Lucerne tours (`features/tours/lucerne`) and their photos.

## Sync log

- **81d5843** (15 Oct 2026): took the dashboard shell (sidebar with brand block and profile,
  `RouteTabs`, `RowActions`, `FilterBar`, skeletons, sheet exit animation), the products
  pages split into Tours, Stays and Experiences, and the Sales all-time row (tours only, with
  a shared `Donut`). Kept our five tours. Dropped about 95 upstream files for features we do
  not ship. Upstream committed two stray notes files, `features/Brienz` and
  `features/Lucerne`; they are pruned.
