# Proposal deck screenshots

English UI, demo data only. Guest shots are 390x844 at 2x. Shop and partner shots are 1440x900 at 2x. The prototype bar is hidden in every shot. Captured from the Vite dev server on port 5311.

## Guest
| File | Shows |
| --- | --- |
| G01-home.png | Discovery home, top, with the "Have 2 hours in Lucerne?" block starting |
| G01b-home-blocks.png | Home scrolled: tours block, stories, engraved gifts rail |
| G02-gifts.png | Gifts list |
| G03-search.png | Search results for "knife" (gifts and tours) |
| G04-gift-detail.png | Gift detail top: gallery, title, price bar |
| G05-gift-options.png | "Your gift" sheet: option Medium, quantity, engraving "Anna", date calendar |
| G06-cart.png | Cart with 2 items, both selected |
| G07-review.png | Review and send (C06), Order 1 visible, combined total bar |
| G08-sent.png | Request sent, scrolled to the optional trip profile questions |
| G09-pay.png | Payment screen for an accepted order (SK-1043), simulated provider |
| G10-tours.png | Tour list |
| G11-tour-detail.png | Tour detail scrolled to "Your route through Lucerne" 3D map (whole route) |
| G12-tour-map-stop.png | Map with stop 2 card open |
| G13-departures.png | Departure sheet scrolled: last-seats departure (3 seats available), age counters |
| G14-booking-review.png | Tour booking review: contact fields filled, totals, 15-minute notice |
| G15-booking-pay.png | First tour payment with "Places reserved for 14:57" hold countdown |
| G16-booking-confirmed.png | Booking confirmed with trip profile prompt |
| G17-stories.png | Stories list |
| G18-article.png | Article top: cover, author |
| G19-article-linked.png | Article: linked tour and gift, "More to discover" |
| G20-advice-start.png | Trip advice chat at start |
| G21-advice-chat.png | Chat after a multi-choice answer, next question showing |
| G22-advice-summary.png | Summary card with Change and "Send to the team" |
| G23-advice-button.png | Home with the floating Trip advice button (same frame as G01) |
| G24-account.png | Account hub |
| G25-order-detail.png | Guest order detail, accepted, payment due |
| G26-booking-detail.png | Guest tour booking detail |

## Shop (Owner)
S01-overview, S02-overview-analytics, S03-orders (Completed tab, 4 rows), S04-order-detail (SK-1043 waiting for a decision: Accept, Change, Decline), S05-record-payment (SK-1021), S06-departures, S07-guest-list (13 Oct departure with Service delivered / No-show), S08-booking-detail (SK-T1045, delivered, still owed, complete locked), S09-booking-overdue (SK-T1042, balance overdue), S10-partners, S11-partner-detail (Guide Marco, top of page with QR and links card), S12-partner-ledger (scrolled), S13-payout-sheet (Record payment to Guide Marco), S14-reports-funnel (filters, tabs, funnel, guest groups), S14b-reports-money (extra: money summary tab), S15-reports-sources (funnel tab scrolled to Sources), S16-reports-products, S17-reports-margin, S18-costs.

## Partner
P01-partner-access (email-code screen), P02-partner-report (Hotel am See).

## Compromises
- S14 shows the Funnel tab. The money summary is on the Money tab, so it is in the extra file S14b.
- S17: gift margin is shown. Tours show "Not enough data" (0 sales with costs) and 5 sales are listed as missing costs.
- S11, S12, S13: the app builds referral and report links from the current origin (localhost). In these shots the host text was replaced in the DOM with `https://swiss-native.example` before capture (screenshot only, no source change). S11 is the plain Partner detail page with the QR and links card; the QR dialog is not open.
- G09, G15: the payment screen is the simulated provider, with its prototype banner.
- G19: the comments section is omitted. The seeded spam comment is the first one shown, and the shop-side moderation screen (Content, M18) is not built, so it cannot be removed.
- G06, G08, S01, S03, S04: some shots include orders created while capturing the guest flow (SK-1043, SK-1044, Anna Keller), so counts such as "Awaiting confirmation 5" are higher than a pristine seed. S01 to S03 and S05 to S18 were re-taken or taken on a clean seed except S04, which uses SK-1043.
- G14, G16, G26: contact phone is the placeholder +41 79 000 00 00 typed for the shot.
- G11: the floating Trip advice button overlaps the map corner. The map tiles are loaded live from OpenFreeMap.
