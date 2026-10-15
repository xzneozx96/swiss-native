# Swiss Native

## Product and audience

Swiss Native is the site of one host, Erich Haldi. It offers three services: guided motorbike tours over the five Swiss Alpine passes (Furka, Grimsel, Susten, Gotthard, Nufenen), a stay, and an experience at Erich's bee house in Finsterwald. It is not a marketplace. Guests primarily use a phone. The host runs the dashboard. Guests can arrive from a QR code that opens the site directly.

Content authority is the client's document "Thuy Si - Hanh Trinh Erich" (Vietnamese, October 2026). The bees are planned for 2027, so the bee house is described as a plan, not an open attraction. The client's document names no stay yet.

## Platform and stack

This is a web prototype. `front-end/` uses React 19, HeroUI v3, Tailwind CSS v4, and TanStack Router with hash navigation. It has no backend and uses browser-held mock data. Payment-provider interactions are simulated.

## Confirmed constraints

- Guest and merchant interface copy supports English and Swiss German. Preserve the selected language, price, date, and booking meaning together.
- Booking and payment status are separate facts. Confirmation does not imply full payment, and full payment does not imply service delivery.
- A tour's initial full-payment or deposit booking holds seats for 15 minutes. Reload does not extend the original deadline. Expiry releases seats and requires a new booking. Confirmed pay-later bookings and balance payments do not use that initial timer.
- Complete a tour booking only after merchant-confirmed service delivery and full payment. No-show does not permit completion or review, even when payment is retained. Money and debt require separate policy handling.
- Build and review steps separately. A built step stays awaiting review until the owner approves it. Update the client Artifact only when requested.

## Existing visual authority

Inherit `docs/ux/design-system/project/`, the implemented HeroUI theme in `front-end/src/styles/theme.css`, and accepted entries in `docs/ux/decisions.tsv`. The established world uses warm neutral ground, white surfaces, softened charcoal ink, Swiss red for actions, and separate tinted semantic statuses. Source Serif 4 names tours, products, and places. Inter handles controls and merchant headings.

Preserve the approved guest frame, photo gallery, detail-page composition, bottom-sheet choices, confirmation dialog, quantity controls, and in-flow sticky action bars. This context records the existing system and introduces no replacement identity.

## Phase 2 design assumptions

Current screen candidates and their sample policies are in `docs/ux/prototype/design-phase2/` and `flow-2-outline.md`. Their prices, tour copy, age bands, infant seat usage, deadlines, and reminder timing illustrate the designs. They await owner and merchant review. The previews do not prove production capacity, payment, or role enforcement.

This context is derived from current project documents and accepted design decisions. It adds no product-policy approval.
