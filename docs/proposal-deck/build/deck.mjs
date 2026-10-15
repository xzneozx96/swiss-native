// Builds docs/proposal-deck/source/deck.html and exports docs/proposal-deck/Swiss-Native-Product-Proposal.pdf
// Usage: node build/deck.mjs [--no-pdf]
import { existsSync, mkdirSync, writeFileSync, copyFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const SHOTS = resolve(ROOT, "screenshots");
const SRC = resolve(ROOT, "source");
const PHOTOS = resolve(HERE, "../../../front-end/src/assets/photos");
mkdirSync(SRC, { recursive: true });
mkdirSync(resolve(SRC, "photos"), { recursive: true });
for (const f of ["lucerne-water-tower.jpg", "lake-steamboat.jpg", "pocket-knife.jpg", "pilatus.jpg", "lucerne-old-town.jpg", "artisan-workshop.jpg", "chocolate-bar.jpg"]) {
  copyFileSync(resolve(PHOTOS, f), resolve(SRC, "photos", f));
}

const BRAND = "Swiss Native";

// ---- icons (one stroke weight, drawn) ------------------------------------
const I = {
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-1-3-5-4-5-1.5S10 8 12 8zm0 0c1-3 5-4 5-1.5S14 8 12 8z"/>',
  route: '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  book: '<path d="M2 5.5C5 4 9 4 12 6c3-2 7-2 10-.5V19c-3-1.5-7-1.5-10 .5-3-2-7-2-10-.5zM12 6v13.5"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  chart: '<rect x="4" y="12" width="3.5" height="8" rx="1"/><rect x="10.25" y="5" width="3.5" height="15" rx="1"/><rect x="16.5" y="9" width="3.5" height="11" rx="1"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c3 0 5 2 5 5"/>',
  person: '<circle cx="12" cy="8" r="3.6"/><path d="M5 21c0-4 3.1-7 7-7s7 3 7 7"/>',
  store: '<path d="M4 9l1.5-5h13L20 9v1a3 3 0 01-6 0 3 3 0 01-4 0 3 3 0 01-6 0zM5 12.5V20h14v-7.5"/>',
  qr: '<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5M20.5 14.5v.01M14.5 20.5h6M17.5 17.5h3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  scatter: '<path d="M4 6h7M4 12h16M4 18h10"/><path d="M15 4l5 5M20 4l-5 5"/>',
};
const icon = (n, s = 40, c = "currentColor", w = 1.7) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const arrow = (s = 56) =>
  `<span class="arrow" style="width:${s}px;height:${s}px"><svg width="${s * 0.45}" height="${s * 0.45}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>`;

// web-sized JPEG copies of the screenshots (keeps the PDF small; originals untouched)
const WEB = resolve(ROOT, "screenshots-web");
mkdirSync(WEB, { recursive: true });
for (const f of readdirSync(SHOTS).filter((n) => n.endsWith(".png"))) {
  const out = resolve(WEB, f.replace(/\.png$/, ".jpg"));
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(resolve(SHOTS, f)).mtimeMs) continue;
  const w = +execFileSync("magick", ["identify", "-format", "%w", resolve(SHOTS, f)]).toString();
  execFileSync("magick", [resolve(SHOTS, f), "-resize", w < 1000 ? "640x>" : "1800x>", "-quality", "78", out]);
}

// ---- media ---------------------------------------------------------------
const shot = (f) => resolve(SHOTS, f);
function img(f, cls, style) {
  if (existsSync(shot(f))) return `<img class="${cls}" style="${style || ""}" src="../screenshots-web/${f.replace(/\.png$/, ".jpg")}" alt="">`;
  return `<div class="${cls} missing" style="${style || ""}">missing<br>${f}</div>`;
}
const PH = { w: 0.462 }; // 390 / 844
function phone(f, h) {
  return `<div class="phone" style="height:${h}px;width:${Math.round(h * PH.w)}px">${img(f, "pimg")}</div>`;
}
function browser(f, w, crop, forceTall, fixedH) {
  // crop: drop the shop sidebar (left 18% of a 1440x900 capture) so the content fills the frame
  const c = crop ? 0.18 : 0;
  const tall = crop || forceTall; // paired frames share one height
  const ih = fixedH || Math.round(w / (1.6 * (tall ? 0.82 : 1)));
  const iw = Math.round(w / (1 - c));
  const im = img(f, "bimg", `width:${iw}px;height:${ih}px;margin-left:${-Math.round(iw * c)}px`);
  return `<div class="browser" style="width:${w}px"><div class="bar"><i></i><i></i><i></i></div><div style="width:${w}px;height:${ih}px;overflow:hidden">${im}</div></div>`;
}
const callouts = (list) =>
  list.map(([t, d]) => `<div class="co"><span class="dot"></span><div><h3>${t}</h3>${d ? `<p>${d}</p>` : ""}</div></div>`).join("");

// ---- slide layouts -------------------------------------------------------
const head = (t, lead) => `<h2>${t}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}`;
const foot = (n, sec) =>
  `<footer><span>${BRAND}<em>·</em>Product proposal<em>·</em>${sec}</span><span>${n}</span></footer>`;
const cap = (c, sub) => `<figcaption><b>${c}</b>${sub ? `<span>${sub}</span>` : ""}</figcaption>`;

// A: callouts left, phones or one browser right
function layoutA(s, n) {
  const k = s.phones ? s.phones.length : 1;
  const arrows = !!s.arrows;
  let media;
  if (s.phones) {
    const h = 600;
    media = s.phones
      .map(([f, c, sub], i) => `${i && arrows ? arrow(48) : ""}<figure style="width:${Math.round(h * PH.w) + 44}px">${phone(f, h)}${cap(c, sub)}</figure>`)
      .join("");
  } else {
    media = `<figure>${browser(s.browsers[0][0], 1040, false, false)}${cap(s.browsers[0][1], s.browsers[0][2])}</figure>`;
  }
  return `<section class="slide A ${arrows ? "withArrows" : ""}">${head(s.title, s.lead)}
  <div class="coCol">${callouts(s.callouts)}</div>
  <div class="media" style="gap:${arrows ? 12 : 36}px">${media}</div>${foot(n, s.sec)}</section>`;
}
// B: flow of phones with captions
function layoutB(s, n) {
  const k = s.phones.length;
  const big = k > 4;
  const h = big ? 500 : 580;
  const media = s.phones
    .map(([f, c, sub], i) => `${i ? arrow(big ? 44 : 56) : ""}<figure style="width:${Math.round(h * PH.w) + (big ? 40 : 70)}px">${phone(f, h)}${cap(c, sub)}</figure>`)
    .join("");
  return `<section class="slide B">${head(s.title, s.lead)}${s.badge ? `<div class="badge">${s.badge}</div>` : ""}
  <div class="flow ${big ? "big" : ""}">${media}</div>${foot(n, s.sec)}</section>`;
}
// C: callout row on top, two browser frames
function layoutC(s, n) {
  const frames = s.browsers.map(([f, c, sub]) => `<figure>${browser(f, 824, f.startsWith("S") || f.startsWith("C") || f.startsWith("D"), true, 500)}${cap(c, sub)}</figure>`).join("");
  return `<section class="slide C">${head(s.title, s.lead)}<div class="coRow">${callouts(s.callouts)}</div>
  <div class="frames">${frames}</div>${foot(n, s.sec)}</section>`;
}

// ---- custom slides -------------------------------------------------------
const credit = (t) => `<p class="credit">${t}</p>`;
const cover = `<section class="slide cover">
  <div class="coverText"><h1>${BRAND}</h1><p class="sub">Product proposal</p>
  <p class="lede">A single platform where visitors to Lucerne discover and request gifts, book fixed-departure tours and read local stories, and where the shop team and referral partners manage orders, bookings, payments and commissions.</p></div>
  <div class="coverPhoto"><img src="photos/lucerne-water-tower.jpg" alt=""></div>${credit("Photo: Kapellbrücke and Water Tower, ermell, CC BY-SA 3.0, Wikimedia Commons")}</section>`;

const problem = (n) => `<section class="slide problem">${head("From scattered records to one shop", "Today the shop tracks partners, orders, payments and commissions by hand. Swiss Native keeps them in one place, for four kinds of guest.")}
  <div class="merge">
    <p class="lab">Tracked separately today</p>
    <div class="chips">${[["Partners", "who referred which guest"], ["Orders", "what was asked for and collected"], ["Payments", "what is paid and still owed"], ["Commissions", "what each partner has earned"]].map(([t, d]) => `<span class="chip"><b>${t}</b><i>${d}</i></span>`).join("")}</div>
    ${arrow(56)}
    <div class="hub"><b>${BRAND}</b></div>
  </div>
  <p class="lab" style="position:absolute;left:760px;top:262px">Four kinds of guest</p>
  <div class="tiles">${[
    ["lucerne-old-town.jpg", "Day-trip groups", "Short on time, so they pick and collect fast"],
    ["pilatus.jpg", "Multi-day groups", "A fixed itinerary with some free time to shop"],
    ["artisan-workshop.jpg", "Independent, several days", "Explore deeper and look for local experiences"],
    ["chocolate-bar.jpg", "Independent, one day", "Flexible but rushed, with small spontaneous buys"],
  ].map(([f, t, d]) => `<figure class="tile"><img src="photos/${f}" alt=""><figcaption><b>${t}</b><span>${d}</span></figcaption></figure>`).join("")}</div>
  ${credit("Photos: Hirschenplatz, JoachimKohler-HB; Pilatus railway, Maria Feofilova. CC BY-SA 4.0, Wikimedia Commons. Others: Pexels and Unsplash licences.")}${foot(n, "Introduction")}</section>`;

const overview = (n) => `<section class="slide overview">${head("One shop for Lucerne keepsakes and tours", "Six capabilities that cover what a visitor does, what the shop runs, and how the business is measured.")}
  <div class="ovPhotos"><img src="photos/lake-steamboat.jpg" alt=""><img src="photos/pocket-knife.jpg" alt=""></div>
  <div class="ovList">${[
    ["gift", "Gifts and keepsakes", "Personalised, requested online, collected at a pickup point."],
    ["route", "Fixed-departure tours", "Seats, deposits and a 15-minute hold while the guest pays."],
    ["book", "Stories", "Articles with audio and video that link to gifts and tours."],
    ["chat", "Trip assistant", "A chat that collects trip details and passes them to the team."],
    ["share", "Referral partners", "QR codes, tracked sales, commissions and payouts."],
    ["chart", "Reports", "Which channels, guests and products actually earn money."],
  ].map(([ic, t, d]) => `<div class="row"><span>${icon(ic, 44, "var(--accent)")}</span><div><h3>${t}</h3><p>${d}</p></div></div>`).join("")}</div>
  ${credit("Photo: Dampfschiff Stadt Luzern, Sputniktilt, CC BY-SA 3.0, Wikimedia Commons. Knife photo: Pexels licence.")}${foot(n, "Introduction")}</section>`;

const roles = (n) => `<section class="slide roles">${head("Three roles, one platform", "Each person sees only what they need: guests shop on a phone, the shop team runs the business on a computer, and partners get a limited report.")}
  <div class="badge">English · German</div>
  <div class="rtri">
    <figure>${phone("G01-home.png", 560)}${cap("Guest", "Browses, requests gifts, books tours, pays and tracks orders on a phone.")}</figure>
    <figure>${browser("S01-overview.png", 620)}${cap("Shop team", "Owner and Manager handle orders, departures, payments, partners and reports.")}</figure>
    <figure>${browser("P02-partner-report.png", 620)}${cap("Referral partner", "Sees only their own sales and commission, never guest contact details.")}</figure>
  </div>${foot(n, "Introduction")}</section>`;

// ---- slide list ----------------------------------------------------------
const S = [
  { custom: () => cover },
  { custom: problem },
  { custom: overview },
  { custom: roles },
  {
    L: "A", sec: "Guest", title: "Discover gifts and tours on your phone",
    callouts: [["Time-based ideas", "“Have 2 hours in Lucerne?” blocks lead into the shop."], ["Clear categories", "Gifts, tours and stories one tap away."], ["Search that scopes", "Find an item or narrow to one category."]],
    phones: [["G01-home.png", "Home"], ["G02-gifts.png", "Gifts"], ["G03-search.png", "Search"]],
  },
  {
    L: "A", sec: "Guest", title: "Choose a gift, make it personal",
    callouts: [["Variants and engraving", "Pick a size, add up to 12 engraved characters."], ["Pickup date and place", "The guest sees the earliest date before asking."], ["Real reviews", "Ratings and photos from earlier buyers."]],
    phones: [["G04-gift-detail.png", "Gift page"], ["G05-gift-options.png", "Choices"]],
  },
  {
    L: "B", sec: "Guest", title: "Request your gifts, pay once accepted",
    badge: "The shop confirms first, then the guest pays within 24 hours",
    phones: [["G06-cart.png", "Cart"], ["G07-review.png", "Review"], ["G08-sent.png", "Request sent"], ["G09-pay.png", "Pay"]],
  },
  {
    L: "A", sec: "Guest", title: "Explore a tour on the map",
    callouts: [["3D route map", "Tap a stop to see what the guide shows there."], ["Tours at a glance", "Duration, from-price and next departure."], ["Seats left per date", "Sold-out departures cannot be picked."]],
    phones: [["G10-tours.png", "Tours"], ["G12-tour-map-stop.png", "Route and stops"], ["G13-departures.png", "Dates and seats"]],
  },
  {
    L: "A", sec: "Guest", title: "Book a tour, hold seats for 15 minutes", arrows: true,
    callouts: [["15-minute seat hold", "The clock starts when payment begins, and survives a reload."], ["Three payment rules", "Full payment, a deposit, or pay later, set per tour."], ["Booking is not payment", "Confirmed and paid are shown as separate facts."]],
    phones: [["G14-booking-review.png", "Details"], ["G15-booking-pay.png", "Pay"], ["G16-booking-confirmed.png", "Confirmed"]],
  },
  {
    L: "A", sec: "Guest", title: "Stories that lead to gifts and tours",
    callouts: [["Blog-style articles", "Cover, contents bar that follows the reader, audio and video."], ["Linked products", "Each story points to gifts and tours."]],
    phones: [["G17-stories.png", "Stories"], ["G18-article.png", "Article"], ["G19-article-linked.png", "Linked gifts and tours"]],
  },
  {
    L: "A", sec: "Guest", title: "Trip advice from the shop's assistant", arrows: true,
    callouts: [["One question at a time", "Choices appear right in the conversation."], ["Sent to the team", "Answers and an email go to the shop, which replies."], ["One tap away", "A floating button on home, tours and stories."]],
    phones: [["G20-advice-start.png", "Start"], ["G21-advice-chat.png", "Conversation"], ["G22-advice-summary.png", "Summary"]],
  },
  {
    L: "A", sec: "Guest", title: "Track every order and booking",
    callouts: [["Status and payment apart", "Accepted, paid and handed over are separate."], ["Pay the balance later", "A deposit booking can be settled from the account."], ["Review after completion", "Only guests who received the service can review."]],
    phones: [["G24-account.png", "Account"], ["G25-order-detail.png", "Order"], ["G26-booking-detail.png", "Booking"]],
  },
  {
    L: "C", sec: "Shop", title: "Overview: what needs you today",
    callouts: [["Tasks waiting", "Requests to answer and balances to collect."], ["Tour work", "Next departures and results still to record."], ["Whole-business view", "Totals and trends beside today's list."]],
    browsers: [["S01-overview.png", "Today"], ["S02-overview-analytics.png", "Analytics"]],
  },
  {
    L: "C", sec: "Shop", title: "Handle gift orders step by step",
    callouts: [["Accept, change or decline", "Move the pickup date or place, with a note."], ["Record payment", "Cash, bank transfer or other, with duplicate checks."], ["Hand over and complete", "Complete only when delivered and fully paid."]],
    browsers: [["S03-orders.png", "Gift orders"], ["S04-order-detail.png", "Order detail"]],
  },
  {
    L: "C", sec: "Shop", title: "Manage tour departures and guest lists",
    callouts: [["Seats against holds", "Confirmed seats and active holds counted separately."], ["Balances to collect", "See who still owes money for each departure."], ["Delivered or no-show", "Recorded per booking after the tour."]],
    browsers: [["S06-departures.png", "Departure schedule"], ["S07-guest-list.png", "Guest list"]],
  },
  {
    L: "C", sec: "Shop", title: "Booking detail, payments and completion",
    callouts: [["Terms as booked", "Price and policy are kept as the guest saw them."], ["Overdue balances", "Each tour cancels, waits, or leaves the call to you."], ["Strict completion", "No-show never earns commission or a review."]],
    browsers: [["S08-booking-detail.png", "Booking detail"], ["S09-booking-overdue.png", "Overdue balance"]],
  },
  {
    L: "C", sec: "Shop", title: "Manage your referral partners",
    callouts: [["Add a partner", "Each gets a QR code and a referral link."], ["Private report link", "Owner can revoke it at any time."], ["Source on every sale", "Orders show which partner brought the guest."]],
    browsers: [["S10-partners.png", "Partners"], ["S11-partner-detail.png", "Partner detail"]],
  },
  {
    L: "C", sec: "Partners", title: "Commissions and payouts, fully tracked",
    callouts: [["Commission ledger", "One line per completed sale, recorded once."], ["Record a payout", "Amount, method, date and who paid."], ["Partner's own view", "Totals and commission only, no guest contact data."]],
    browsers: [["S13-payout-sheet.png", "Ledger and payout"], ["P02-partner-report.png", "Partner report"]],
  },
  {
    L: "C", sec: "Reports", title: "See which channels and guests convert",
    callouts: [["Smart filters", "Period, partner, guest group, goods or tours."], ["The sales funnel", "From link opened to completed, with drop-off."], ["Four guest groups", "Compared side by side, with an honest “unknown”."]],
    browsers: [["S14-reports-funnel.png", "Money and funnel"], ["S15-reports-sources.png", "Sources and guest groups"]],
  },
  {
    L: "C", sec: "Reports", title: "Best sellers, operations and margin",
    callouts: [["Best sellers", "Products, variants and tours ranked."], ["Operations", "Delivered, no-show and cancelled counts."], ["Contribution margin", "Shown only when every cost is recorded."]],
    browsers: [["S16-reports-products.png", "Products and operations"], ["S17-reports-margin.png", "Contribution margin"]],
  },
];

const LEADS = {
  5: "Guests land on a home page of time-based ideas, browse gifts by category, and search across gifts and tours.",
  6: "Each gift page shows what makes it special, then lets the guest choose a size, add engraving and pick a collection date.",
  7: "Guests ask for gifts rather than buying at once: the shop confirms each request first, and only then does the guest pay.",
  8: "Fixed-departure tours show their route on a 3D map and how many seats are left on each date.",
  9: "Booking a tour takes three steps, and seats are held for 15 minutes while the guest pays so no one loses a place mid-payment.",
  10: "Stories are short local articles that guide visitors to the gifts and tours that fit what they just read.",
  11: "A chat asks the guest a few questions about their trip, then sends the answers to the shop team so they can follow up by email.",
  12: "One account shows every gift order and tour booking with its progress, so guests always know what is paid, confirmed or ready.",
  13: "The Overview is the shop team's starting page: what needs action today, and how the whole business is doing.",
  14: "Each gift request moves through clear steps, from the shop's decision to payment, preparation and hand-over to the guest.",
  15: "For every departure the shop sees booked seats against capacity, who still owes money, and records what happened after the tour.",
  16: "Each booking keeps the exact terms the guest agreed to, and can be completed only once the service is delivered and fully paid.",
  17: "Partners are guides, hotels or others who bring guests. Each gets a QR code and a link so every sale can be traced back to them.",
  18: "Commission is worked out per completed sale, the shop records payouts, and each partner gets a private report of their own results.",
  19: "Reports show where guests come from and how far they get, from the first link opened to a completed, paid sale.",
  20: "Beyond sales, the shop sees best sellers, how bookings ended, and the real margin once every cost is recorded.",
};
const SUBS = {
  5: ["Time-based ideas and categories", "Browse by category", "Gifts and tours in one search"],
  6: ["Photos, story, reviews, price", "Size, engraving, date"],
  7: ["Choose which gifts to request", "Sign in and send; nothing is charged yet", "The shop reviews each order", "Once accepted, pay within 24 hours"],
  8: ["Duration, from-price, next date", "Tap a stop to explore it", "Seats left on every date"],
  9: ["Contact and group details", "Seats held for 15 minutes", "Reference and meeting point"],
  10: ["Local articles in your language", "Cover, author, reading time", "Products related to the story"],
  11: ["The assistant introduces itself", "One question at a time", "Check, change, then send to the team"],
  12: ["Orders, bookings, payments", "Progress, payments, policy", "Timeline and balance due"],
  13: ["Tasks and tour work waiting", "Earnings and trends"],
  14: ["Filter requests by status", "Accept, change or decline"],
  15: ["Seats against capacity", "Delivered or no-show per booking"],
  16: ["Terms as booked, and payments", "What the shop decides next"],
  17: ["Performance at a glance", "QR code, links, commission"],
  18: ["Record what was paid", "The partner's own view"],
  19: ["Earnings and the visit-to-sale funnel", "Where guests come from"],
  20: ["Best sellers and how sales ended", "Margin and missing costs"],
};
const media = (x) => x.phones || x.browsers;
S.forEach((x, i) => {
  const n = i + 1;
  if (LEADS[n]) x.lead = LEADS[n];
  if (SUBS[n] && media(x)) media(x).forEach((m, j) => { if (m[2] === undefined && SUBS[n][j]) m[2] = SUBS[n][j]; });
});

// ---- merge the flow-coverage agents' output (extra/A..D.json) --------------
const SEC = { A: "Guest", B: "Guest", C: "Shop", D: "Partners" };
const newBy = {};
for (const L of ["A", "B", "C", "D"]) {
  const fp = resolve(ROOT, "extra", `${L}.json`);
  if (!existsSync(fp)) continue;
  const ex = JSON.parse(readFileSync(fp, "utf8"));
  for (const r of ex.revise || []) {
    const x = S[r.slide - 1];
    if (!x || x.custom) continue;
    if (r.title) x.title = r.title;
    if (r.lead) x.lead = r.lead;
    if (r.callouts) x.callouts = r.callouts;
    if (r.captions && media(x)) r.captions.forEach((c, j) => { if (media(x)[j]) { const [cp, sb] = Array.isArray(c) ? c : [c, undefined]; media(x)[j][1] = cp; media(x)[j][2] = sb; } });
  }
  for (const nw of ex.new || []) {
    const x = { L: nw.layout, sec: nw.sec || SEC[L], title: nw.title, lead: nw.lead, callouts: nw.callouts, phones: nw.phones, browsers: nw.browsers, badge: nw.badge, arrows: nw.arrows, agent: L, id: nw.id };
    (newBy[nw.after] = newBy[nw.after] || []).push(x);
  }
}
const SECOVR = { "D-article-media": "Guest", "D-advice-steps": "Guest", "D-partner-add": "Partners", "D-partner-links": "Partners", "D-portal-access": "Partners", "D-portal-ledger": "Partners", "D-costs": "Reports" };
S[16].sec = "Partners";
Object.values(newBy).flat().forEach((y) => { if (SECOVR[y.id]) y.sec = SECOVR[y.id]; });
const DROP = new Set(["C-shop-notifications", "C-noshow-reconcile", "D-partner-compare", "D-report-filters"]);
const ordered = [];
const emit = (x, key) => { ordered.push(x); (newBy[key] || []).filter((y) => !DROP.has(y.id)).forEach((y) => emit(y, y.id)); };
S.forEach((x, i) => emit(x, i + 1));

const body = ordered.map((s, i) => {
  const n = i + 1;
  if (s.custom) return s.custom(n);
  return s.L === "A" ? layoutA(s, n) : s.L === "B" ? layoutB(s, n) : layoutC(s, n);
}).join("\n");
const S_LEN = ordered.length;

const css = `
:root{--bg:#f7f7f5;--ink:#33312e;--muted:#5e5e5a;--accent:#d52b1e;--soft:#fce9e7;--surface:#fff;--line:#dcdcd7;
--shadow:0 2px 4px rgba(51,49,46,.06),0 18px 44px rgba(51,49,46,.16)}
*{box-sizing:border-box;margin:0;padding:0}
@page{size:1920px 1080px;margin:0}
html,body{background:#ddd}
body{font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.slide{position:relative;width:1920px;height:1080px;background:var(--bg);overflow:hidden;page-break-after:always;break-after:page}
h2{position:absolute;left:112px;top:84px;width:1500px;font-family:"Source Serif 4",Georgia,serif;font-weight:500;font-size:68px;line-height:1.08;letter-spacing:-.02em;text-wrap:balance}
footer{position:absolute;left:112px;right:112px;bottom:34px;display:flex;justify-content:space-between;font-size:20px;color:var(--muted);font-variant-numeric:tabular-nums}
footer em{font-style:normal;margin:0 12px;opacity:.5}
figure{display:flex;flex-direction:column;align-items:center;gap:18px}
figcaption{font-size:24px;color:var(--muted);text-align:center;line-height:1.3}
figcaption b{display:block;color:var(--ink);font-weight:600;font-size:28px;margin-bottom:2px}
figcaption span{display:block}
.phone{border-radius:42px;overflow:hidden;box-shadow:var(--shadow);background:#fff}
.pimg{width:100%;height:100%;display:block;object-fit:cover;object-position:top}
.browser{border-radius:14px;overflow:hidden;box-shadow:var(--shadow);background:#fff}
.browser .bar{height:34px;background:#efefec;display:flex;align-items:center;gap:8px;padding-left:16px}
.browser .bar i{width:11px;height:11px;border-radius:50%;background:#c9c9c4;display:block}
.bimg{display:block;object-fit:cover;object-position:top}
.missing{display:flex;align-items:center;justify-content:center;text-align:center;background:#eee;color:#999;font-size:20px;line-height:1.4}
.arrow{flex:none;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:var(--soft);color:var(--accent)}
.co{display:flex;gap:20px;align-items:flex-start}
.co .dot{flex:none;width:16px;height:16px;border-radius:50%;background:var(--accent);margin-top:14px}
.co h3{font-size:38px;font-weight:600;line-height:1.2}
/* A */
.A .coCol{position:absolute;left:112px;top:380px;width:540px;display:flex;flex-direction:column;gap:56px}
.A.withArrows .coCol{width:500px}
.A .media{position:absolute;right:112px;top:236px;display:flex;align-items:center;justify-content:flex-end}
.A .media figure{gap:16px}
.A .media>.arrow{margin-bottom:60px}
/* B */
.B .flow{position:absolute;left:0;right:0;top:236px;display:flex;justify-content:center;align-items:flex-start;gap:40px}
.B .flow>.arrow{margin-top:270px}
.B .badge{position:absolute;right:112px;top:108px;max-width:560px;font-size:24px;line-height:1.35;font-weight:500;background:var(--soft);color:#a3241a;padding:14px 22px;border-radius:14px}
/* C */
.C .coRow{position:absolute;left:112px;right:112px;top:196px;display:grid;grid-template-columns:repeat(3,1fr);gap:56px}
.C .co h3{font-size:32px}.C .co .dot{margin-top:12px}
.C .frames{position:absolute;left:112px;top:268px;display:flex;gap:48px}
.C figure{gap:14px}
/* cover */
.cover{display:flex;background:var(--bg)}
.coverText{width:960px;padding:0 112px;display:flex;flex-direction:column;justify-content:center;gap:28px}
.cover h1{font-family:"Source Serif 4",Georgia,serif;font-weight:500;font-size:132px;line-height:1;letter-spacing:-.03em}
.cover .sub{font-size:40px;font-weight:600;color:var(--accent)}
.cover .lede{font-size:30px;line-height:1.45;color:var(--muted);max-width:640px;margin-top:20px}
.coverPhoto{width:960px;height:1080px}
.coverPhoto img{width:100%;height:100%;object-fit:cover;display:block}
.credit{position:absolute;left:112px;bottom:78px;width:560px;font-size:16px;line-height:1.4;color:var(--muted)}
.cover .credit{bottom:40px}
/* problem */
.lab{font-size:24px;font-weight:600;color:var(--muted);align-self:flex-start}
.merge{position:absolute;left:112px;top:250px;width:520px;display:flex;flex-direction:column;align-items:center;gap:26px}
.chips{display:flex;flex-direction:column;gap:14px;width:100%}
.chip{display:block;font-size:32px;font-weight:500;background:var(--surface);border-radius:12px;padding:20px 28px;box-shadow:0 1px 3px rgba(51,49,46,.1)}
.merge .arrow{transform:rotate(90deg)}
.hub{width:100%;background:var(--ink);color:#fff;border-radius:16px;padding:30px;text-align:center}
.hub b{font-family:"Source Serif 4",Georgia,serif;font-weight:500;font-size:48px}
.tiles{position:absolute;left:760px;top:240px;display:grid;grid-template-columns:1fr 1fr;gap:24px;width:1048px}
.tile{position:relative;width:512px;height:372px;border-radius:14px;overflow:hidden;box-shadow:var(--shadow);display:block}
.tile img{width:100%;height:100%;object-fit:cover;display:block}
.tile figcaption{position:absolute;left:0;right:0;bottom:0;padding:70px 26px 22px;color:#fff;font-size:32px;font-weight:600;text-align:left;background:linear-gradient(to top,rgba(30,28,26,.72),rgba(30,28,26,0))}
/* overview */
.ovPhotos{position:absolute;left:112px;top:236px;width:640px;display:flex;flex-direction:column;gap:24px}
.ovPhotos img{width:640px;height:352px;object-fit:cover;border-radius:14px;display:block;box-shadow:var(--shadow)}
.ovList{position:absolute;left:880px;right:112px;top:236px;display:flex;flex-direction:column}
.ovList .row{display:flex;gap:32px;align-items:center;height:124px;border-bottom:1px solid var(--line)}
.ovList .row:last-child{border-bottom:0}
.ovList h3{font-family:"Source Serif 4",Georgia,serif;font-weight:500;font-size:48px}
/* roles */
.rtri{position:absolute;left:112px;right:112px;top:236px;display:flex;justify-content:space-between;align-items:flex-end}
.rtri figure{gap:22px}
.roles .badge{position:absolute;right:112px;top:108px;font-size:24px;font-weight:600;background:var(--soft);color:#a3241a;padding:12px 22px;border-radius:12px}

/* richer-text layout (overrides) */
.lead{position:absolute;left:112px;top:168px;width:1440px;font-size:28px;line-height:1.4;color:var(--muted);text-wrap:pretty}
h2{top:70px}
.co h3{font-size:34px;line-height:1.2}
.co p{display:block;font-size:24px;line-height:1.4;color:var(--muted);margin-top:6px}
.co .dot{margin-top:12px}
figcaption span{font-size:22px;line-height:1.35}
.A .coCol{top:290px;width:560px;gap:40px}
.A.withArrows .coCol{width:500px}
.A .media{top:250px}
.B .flow{top:272px;gap:24px}.B .flow.big{gap:16px}
.B .flow>.arrow{margin-top:250px}
.B .badge{top:76px;max-width:520px;font-size:22px}
.C .coRow{top:268px;gap:48px}
.C .co h3{font-size:30px}.C .co p{font-size:22px;line-height:1.38}.C .co .dot{margin-top:10px}
.C .frames{top:420px}
.cover .lede{font-size:28px;max-width:700px}
.chip{display:block;padding:14px 22px}
.chip b{display:block;font-size:30px;font-weight:600;font-style:normal}
.chip i{display:block;font-style:normal;font-size:22px;color:var(--muted);margin-top:2px}
.merge{top:262px}.chips{gap:12px}
.tiles{top:300px}.tile{height:330px}
.tile figcaption{padding:70px 24px 20px}
.tile figcaption b{display:block;font-size:30px;font-weight:600;color:#fff}
.tile figcaption span{display:block;font-size:22px;font-weight:400;margin-top:2px;color:#f1efeb}
.hub{padding:22px}
.ovPhotos{top:292px;width:600px;gap:20px}.ovPhotos img{width:600px;height:300px}
.ovList{left:800px;top:280px}
.ovList .row{height:108px}
.ovList h3{font-family:Inter,sans-serif;font-weight:600;font-size:34px}
.ovList p{font-size:24px;color:var(--muted);margin-top:4px}
.rtri{top:292px}
.rtri figcaption{max-width:540px;font-size:22px}
.rtri figcaption b{font-size:30px}
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${BRAND} — Product proposal</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet">
<style>${css}</style></head><body>${body}</body></html>`;
const htmlPath = resolve(SRC, "deck.html");
writeFileSync(htmlPath, html);
console.log("wrote", htmlPath, S_LEN, "slides");

if (!process.argv.includes("--no-pdf")) {
  const req = createRequire("/home/ross-geller/Projects/minastik/swiss-native/web/package.json");
  const { chromium } = req("playwright");
  const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto("file://" + htmlPath, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: resolve(ROOT, "Swiss-Native-Product-Proposal.pdf"), width: "1920px", height: "1080px", printBackground: true });
  if (process.argv.includes("--png")) {
    mkdirSync(resolve(ROOT, "preview"), { recursive: true });
    const n = await p.$$eval(".slide", (e) => e.length);
    for (let i = 0; i < n; i++) {
      const el = (await p.$$(".slide"))[i];
      await el.screenshot({ path: resolve(ROOT, "preview", `s${String(i + 1).padStart(2, "0")}.png`) });
    }
  }
  await b.close();
  console.log("pdf done");
}
