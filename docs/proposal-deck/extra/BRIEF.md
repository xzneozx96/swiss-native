# Shared brief for the flow-coverage agents (deck revision)

Project: /home/ross-geller/Projects/minastik/swiss-keepsakes (a client proposal deck for the product "Swiss Native"; the app UI still says "Swiss Keepsakes").
Deck source: docs/proposal-deck/build/deck.mjs (read-only for you; the coordinator merges). Current deck = 20 slides (see list below). Existing screenshots + how they were taken: docs/proposal-deck/screenshots/INDEX.md. Outline: docs/proposal-deck/outline.md.

## Why you exist
The client said (1) the slide text is too short to understand for a first-time reader and (2) important user flows must be fully covered and shown with screenshots. Each agent owns ONE area of the app. Your job: audit your area's flows against the current deck, capture the screenshots that are missing, and write the slide copy (new slides plus revised copy for the existing slides in your area).

## Current slides (number: title)
5 Discover gifts and tours on your phone (G01 home, G02 gifts, G03 search)
6 Choose a gift, make it personal (G04, G05)
7 Request your gifts, pay once accepted (G06 cart, G07 review, G08 sent, G09 pay)
8 Explore a tour on the map (G10, G12, G13)
9 Book a tour, hold seats for 15 minutes (G14, G15, G16)
10 Stories that lead to gifts and tours (G17, G18, G19)
11 Trip advice from the shop's assistant (G20, G21, G22)
12 Track every order and booking (G24 account, G25 order, G26 booking)
13 Overview: what needs you today (S01, S02)
14 Handle gift orders step by step (S03, S04)
15 Manage tour departures and guest lists (S06, S07)
16 Booking detail, payments and completion (S08, S09)
17 Manage your referral partners (S10, S11)
18 Commissions and payouts, fully tracked (S13, P02)
19 See which channels and guests convert (S14, S15)
20 Best sellers, operations and margin (S16, S17)

## How to find the flows
Read docs/ux/prototype/flow-1-outline.md (gift flow), flow-2-outline.md (tours), flow-4-outline.md (content, advice), flow-5-outline.md (partners, reports), todo.md / todo-phase2.md / todo-phase4.md / todo-phase5.md (what is built and approved), PRODUCT.md, and the routes in front-end/src/routes and features in front-end/src/features. Only cover what is BUILT (e.g. the Stays/Experiences pages, private-tour request, product/content editors, refunds are NOT built: skip them).

## Capturing (rules learned in the first pass)
- Run your own vite on YOUR port (given below): `cd front-end && npx vite --port <PORT> --strictPort` in the background. Do NOT use ports 5173 or other agents' ports. No edits under front-end/src or docs/ux. Kill what you start and verify the port is free at the end.
- Drive it with Playwright for Node: require via /home/ross-geller/Projects/minastik/swiss-native/web/node_modules (playwright). The bundled browsers do not match, so launch with executablePath "/usr/bin/google-chrome". Fresh browser context per flow (demo state lives in localStorage). English only. Wait for fonts, images and the map before each shot; hide the prototype bar with injected CSS; no toasts.
- Guest shots: viewport 390x844, deviceScaleFactor 2, mobile. Shop and partner shots: 1440x900, deviceScaleFactor 2. (The deck crops the left 18% sidebar off shop shots, so keep the key content right of the sidebar.)
- Never show 'localhost' text: rewrite host text nodes to https://swiss-native.example in the DOM before the shot (screenshot-only).
- Check every PNG by eye (Read it): no spinners, raw i18n keys like a.b.c, half-loaded images, debug banners other than the prototype's own "simulated payment provider" strip, or empty tables. Retake until clean. Use only demo data the app seeds or creates through normal flows; never fake text.
- Reuse existing shots in docs/proposal-deck/screenshots/ where they already show the step; capture only what is missing. New files go in docs/proposal-deck/screenshots/ with YOUR PREFIX (below), e.g. `A01-signin.png`. Do not overwrite existing files.

## Output: docs/proposal-deck/extra/<LETTER>.json (valid JSON)
{
  "area": "...",
  "coverage": [ {"flow": "name of flow/step", "status": "already in deck | new slide | skipped (why)", "slide": "ref"} ],   // the audit
  "revise": [ {"slide": 7, "title": "optional new headline", "lead": "...", "callouts": [["Title","Description"], ...], "captions": ["...", ...]} ],   // better copy for existing slides in your area; captions are per screenshot in the slide's current order
  "new": [ {"id": "A-signin", "after": 7, "title": "...", "lead": "...", "layout": "A|B|C",
            "phones": [["A01-signin.png","Caption","optional one-line sub"]],       // A: 1-3 phones, B: 4-5 phones as a flow
            "browsers": [["C01-x.png","Caption"]],                                    // A: 1 browser, C: exactly 2 browsers
            "callouts": [["Title","Description"]],                                    // A and C: exactly 3
            "badge": "optional short pill, layout B only" } ]
}
Layouts: A = callouts column left + (1-3 phones OR 1 browser) right; B = row of 4-5 phones with arrows and captions (flows); C = 3 callouts on top + 2 browser frames (shop/partner screens).

## Copy rules (this matters: the client found the text too thin)
Write for a first-time reader who has never seen the product and is not technical. Say what the screen is for, who uses it, what they do, and what happens next. Plain language; define terms on first use (e.g. departure, seat hold, balance, concierge-style words, commission). Still concise:
- title: 8 words or fewer, specific (not "Overview").
- lead: ONE sentence, up to 28 words, under the headline, explaining what this slide shows and why it matters to the business.
- each callout: title up to 5 words + description of ONE sentence, up to 22 words, explaining the rule or benefit (name real numbers/rules from the app: 15-minute hold, 24 hours, 30% deposit, CHF amounts shown, etc.). Be accurate to the built behaviour; verify against the app and flow outlines. Never promise AI-generated plans (the trip assistant only asks the shop's configured questions and passes answers to the team).
- captions: up to 4 words + optional sub up to 12 words.
- No marketing fluff. No claims you did not verify in the app.
Add new slides only where a key flow step is not understandable from the existing slides; aim for a complete, logical walk-through of your area, typically 3 to 7 new slides. Do not duplicate screens already shown.

## Report back (under 150 words)
Number of new slides, number of new screenshots, what you could not capture and why, any accuracy concerns about existing slide claims.
