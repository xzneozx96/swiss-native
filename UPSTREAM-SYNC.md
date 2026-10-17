# Syncing with upstream (Swiss Keepsakes)

This repo is a long-lived fork of `swiss-keepsakes`. Upstream is the git remote `upstream`
(push disabled). We merge from it; we never rebase and never push to it.

| | |
|---|---|
| Fork point | `c7850da` (upstream, 14 Oct 2026) |
| Last synced | `37bafc7` (upstream `main`: trip assistant demo) |
| Synced on | 17 Oct 2026, tag `upstream-synced-37bafc7` |

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
- **Background music**: the track and its cover are ours, not upstream's
  (`assets/audio/background-swiss-native.mp3` and `-cover.jpg`, "Wo der Wind zu Hause ist", see
  `assets/audio/CREDITS.txt`). If upstream adds, renames or replaces its track
  (`background-swiss-keepsakes*`), delete theirs again and keep ours wired in
  `background-music.tsx` and `music-sheet.tsx`. The sheet and the media session show
  `app.name`, never a song or artist name. The launcher floats above our tab bar's right end;
  upstream stacks it on a floating trip assistant button, which we do not ship (our assistant
  is the raised tab bar button).
- **Trip assistant** (`features/planner`, `routes/_guest/plan.tsx`, `components/ai-elements`):
  the chat UI, transport and session are upstream's; the script is ours. Upstream plans a Lucerne
  day (`data/places.ts`, `data/walking.ts`, `lib/hours.ts`, `lib/plan.ts`, `lib/agent.ts`,
  `components/pickers.tsx`, `components/itinerary-card.tsx`); ours matches a motorbike pass tour,
  offers its real open departures (demo store) and lays out the tour's own days, stops, times,
  price and conditions from `tourSeed`, in English and German, and files the plan as a private
  tour request. It invents nothing the tour does not say. Take upstream's changes to the chat UI, transport and `ai-elements`; skip its
  Lucerne data and script, and re-apply ours if a merge touches them.
- **Guest departure picker**: ours is `features/tours/discovery/listing-picker` (tours, stays and
  experiences). Upstream's `departure-picker` is a port of it without stays; it is pruned.

## Not shipped (removed on purpose)

Keepsake shop (gifts, cart, checkout, orders, pickup points, categories), partners and
referral (`/partner`, `/r/$code`, commission), local stories and content, reports and costs,
trip advice (the old questionnaire), upstream's Lucerne trip planner content, the manager and partner roles, the dashboard Requests section, the lab pages,
upstream's 11 Lucerne tours (`features/tours/lucerne`) and their photos. Our own design lab
(`features/lab/brand`, `routes/_guest/lab.*`) is kept; the prune script removes only upstream's.

## Sync log

- **37bafc7** (17 Oct 2026): merged with `-s ours` (so upstream's history counts as merged) and
  took only the trip assistant: the `ai-elements` components, the chat session and scripted
  transport, and the tab bar with the assistant raised in a notch (`nav.assistant`, the sparkle
  and the chat motion utilities in `globals.css`; new dependencies `ai`, `@ai-sdk/react`,
  `use-stick-to-bottom`). Rewrote the script for Swiss Native: it asks how you ride, how many
  riders and which passes draw you, finds the open departures of the matching tour, builds the
  tour's own plan on the chosen date (base day, ride-out day with stops and times, free days,
  price, conditions), lets you switch tour or date or add the Finsterwald night, and sends it
  to Erich as a private tour request. Skipped: upstream's home rework, Victorinox, local stories, Lucerne
  tours, tour sections and keepsakes on tour pages, the advice banner and floating assistant
  button, and the planner's Lucerne data.

- **ba3ff8f** (16 Oct 2026): took the simpler music sheet (no volume or skip controls, seek thumb
  always visible, one-line description under the title; `music.volume`, `music.back`,
  `music.forward`, `music.mute`, `music.unmute` and their icons are gone). Skipped: the assistant
  gradient and sparkle (`bg-assistant`, `AssistantAvatar`), and the blank-band fix on
  `TripAdviceButton` / the order pay route, which are pruned. Our guest shell already gives
  `ownsBottomSpace` screens no extra bottom padding.

- **4934b13** (16 Oct 2026): took the guest background music player as built (launcher, player
  sheet with cover, seek, skip 10 s and volume, remembered play/pause and volume, autoplay after
  the first gesture, pausing for other media and hidden tabs, media session controls). Swapped
  in our track and its embedded cover art (remuxed without re-encoding, tags and cover
  stripped). The launcher sits alone above the tab bar's right end on tab-bar screens; screens
  with `hideTabBar` have none, the dashboard has none. Guest pages get 48px more bottom padding
  so content scrolls clear of it. Messages moved into `i18n/en.ts` and `de.ts` (upstream put
  them in `features/content`, which we prune). Skipped: the tab bar redesign (raised gradient
  assistant button in a notch, sparkle animation, `nav.assistant`), the launcher stacked on
  `TripAdviceButton`, upstream's track, cover and credit, and `docs/background-music`
  (screenshots of their keepsake screens).

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
