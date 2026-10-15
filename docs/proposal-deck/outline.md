# Swiss Keepsakes: product proposal deck, outline (draft 3 (built))

Format follows the Kehre proposal (`swiss-native/docs/proposal-deck`): 16:9, visual first, one large phone or browser screenshot per slide, headline of 8 words or fewer, at most 3 short callouts, flows drawn as step arrows. Features and flows only: no timeline, pricing, risks or metrics.

Sources of truth: PRD v2 (`docs/PRD`), `docs/ux/prototype/todo*.md` (what is approved), the built routes in `front-end/src`.

## Slides

| # | Section | Headline (draft) | Main graphic | What the client learns | Built from |
|---|---|---|---|---|---|
| 1 | Intro | Swiss Keepsakes: product proposal | Full-bleed Lucerne photo | Cover | Lucerne hero image |
| 2 | Intro | From scattered records to one shop | Left: today (partners, orders, money owed, commission tracked outside any system). Right: four guest groups with the client's persona photos | The problem and who it serves | PRD §1, §3; `client-resources/*.jpeg` |
| 3 | Intro | One shop for Lucerne keepsakes and tours | Tiles: gifts, tours, stories, AI trip assistant, partner referrals, analytics | The product in one page | C01 home |
| 4 | Intro | Three roles, one platform | Guest (phone), shop team (Owner, Manager), referral partner (limited view). EN / DE | Who uses what | Guest app, `/store`, `/partner` |
| 5 | Guest | Discover gifts and tours on your phone | Home, gift list, search. Callouts: "2 hours in Lucerne" blocks, categories, search | How guests find things | C01, C02, search |
| 6 | Guest | Choose a gift, make it personal | Gift detail plus choices sheet. Callouts: variants and engraving, pickup date and place, reviews | The gift page | C03 |
| 7 | Guest | Request your gifts, pay once accepted | Step arrows: cart, review, sign in, request sent, pay. Badge: "shop confirms first, pay within 24 hours". Callout: optional trip profile | Gift request-to-payment flow | C04 to C07, C12 |
| 8 | Guest | Explore a tour on the map | Tour list, 3D route map with stop card, departure sheet with seats left | Tour discovery | C08, C09, C10 |
| 9 | Guest | Book a tour, hold seats for 15 minutes | Step arrows: details, pay deposit or full, confirmed. Badges: full / deposit / pay-later, "15-min hold" | Tour booking and payment rules | C11, C12, C13 |
| 10 | Guest | Stories that lead to gifts and tours | Stories list, article. Callouts: contents bar, audio and video, linked gifts and tours, comments | Content that sells | C19, C20 |
| 11 | Guest | Trip advice from the shop's assistant | Large chat screen, plus the floating button on home, tour and article. Callouts: asks the shop's questions one at a time, offers choices in the chat, sends answers to the team by email. Note on slide: asks configured questions only, builds no plan (in owner review) | AI assistant feature | C21 (4.5, awaiting review) |
| 12 | Guest | Track every order and booking | Account hub, order detail tabs, booking detail. Callouts: status and payment shown separately, balance payment, review after completion | After-sale experience | C14, C15, C16, C18 |
| 13 | Shop | Overview: what needs you today | Merchant Overview, Today tiles. Callouts: tasks waiting, tour work, all-time summary | Shop dashboard | M02 |
| 14 | Shop | Handle gift orders step by step | Order list, order detail. Callouts: accept or change date and place or decline, record cash or bank payment, mark handed over | Gift order management | M03, M04, M08 |
| 15 | Shop | Manage tour departures and guest lists | Departure schedule, guest list. Callouts: confirmed seats vs active holds, outstanding balances, delivered or no-show per guest | Booking management (1/2) | M05, M06 |
| 16 | Shop | Booking detail, payments and completion | Booking detail, record payment sheet. Callouts: price and policy snapshot, record external payment, overdue-balance policy, completion only after delivery and full payment | Booking management (2/2) | M07, M08, 2.13, 2.14 |
| 17 | Partners | Manage your referral partners | Partner list and partner detail. Callouts: add partner, downloadable QR and referral link, revoke report link (owner only) | Partner management (1/2) | M15, M16 |
| 18 | Partners | Commissions and payouts, fully tracked | Commission ledger and payout sheet, plus the partner's own report via email code. Callouts: commission per transaction, record as paid, partner sees totals only, no guest contact data | Partner management (2/2) | M16, P01, P02 |
| 19 | Analytics | See which channels and guests convert | Reports: filters, money summary, funnel, sources, guest groups. Callouts: link opened to completed funnel, source comparison, four guest groups | Analytics (1/2) | M21, M02 analytics |
| 20 | Analytics | Best sellers, operations and margin | Products and operations, contribution margin, cost data entry. Callouts: best sellers, no-show and cancellation counts, margin only when costs are complete | Analytics (2/2) | M21, M24 |

No rules slide and no closing slide (owner, 2026-10-14): the manual guide is a separate document. The deck ends on the last analytics slide.

## Decisions needed before I write slides (with my recommendation)

1. **Brand name on the cover.** PRD v2 leaves it open between "Swiss Stories & Gifts" and "Lucerne Keepsake"; the app shows "Swiss Keepsakes". Kehre used a `[Brand]` placeholder until settled. Recommend: "Swiss Keepsakes" (matches the deployed site), easy to swap.
2. **Language.** PRD is Vietnamese, the app is EN and DE, Kehre is English. Your call: English, Vietnamese, or both.
3. **Live link.** Closing slide dropped (owner, manual guide is a separate doc). Optionally put the deployed URL on the cover. Need the URL.
4. **Screenshots.** Fresh captures from the deployed site: phone width for guest, desktop for shop and partner.

## Status caveats (from todo.md, to stay accurate)

- Phase 4 stories and article are approved; the advice chat (4.5) is built and awaiting owner review. The system must not promise AI-generated plans (PRD §1.2), so slide 10 says "asks the shop's questions" only.
- Phase 4 shop-side editors (M11 to M20) and C22, C23 are not built.
- Payments, mail and data are simulated in a browser demo; no backend. The deck should say "working prototype".
- Stays and Experiences pages are placeholders; keep them out of the deck.

## Decided

- Product name on the deck: **Swiss Native** (owner, 2026-10-14). The app UI and shop screenshots still say "Swiss Keepsakes".
- Deck language: English (owner).
- Build: `node build/deck.mjs --png` writes `source/deck.html`, `Swiss-Native-Product-Proposal.pdf` and `preview/*.png`. Screenshots are in `screenshots/` (see `screenshots/INDEX.md`).
