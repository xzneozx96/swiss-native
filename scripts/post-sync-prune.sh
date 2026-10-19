#!/usr/bin/env bash
# Run right after `git merge upstream/main --no-commit`, before resolving anything else.
# Removes what upstream adds for features Swiss Native does not ship, so it never has to be
# reviewed again. Safe to run repeatedly. See UPSTREAM-SYNC.md.
set -euo pipefail
cd "$(dirname "$0")/.."
S=front-end/src

git rm -rq --ignore-unmatch --cached -- \
  "$S/features/content" "$S/features/reports" "$S/features/partners" \
  "$S/features/merchant/partners" "$S/features/requests/merchant" \
  "$S/features/catalog/categories.ts" "$S/features/tours/lucerne" \
  "$S/features/tours/discovery/departure-picker" "$S/routes/store/content" \
  "$S/routes/store/partners" \
  "$S/routes/store/reports" "$S/routes/store/requests" \
  "$S/routes/store/products/gifts" "$S/routes/store/products/categories.tsx" \
  "$S/routes/store/products/pickup.tsx" "$S/routes/partner" "$S/routes/r.\$code.tsx" \
  "$S/features/Brienz" "$S/features/Lucerne" \
  "$S/assets/audio/background-swiss-keepsakes.mp3" \
  "$S/assets/audio/background-swiss-keepsakes-cover.jpg" docs/background-music 2>/dev/null || true

# Remove the same paths from the working tree.
rm -rf \
  "$S/features/content" "$S/features/reports" "$S/features/partners" \
  "$S/features/merchant/partners" "$S/features/requests/merchant" \
  "$S/features/catalog/categories.ts" "$S/features/tours/lucerne" \
  "$S/features/tours/discovery/departure-picker" "$S/routes/store/content" \
  "$S/routes/store/partners" \
  "$S/routes/store/reports" "$S/routes/store/requests" \
  "$S/routes/store/products/gifts" "$S/routes/store/products/categories.tsx" \
  "$S/routes/store/products/pickup.tsx" "$S/routes/partner" "$S/routes/r.\$code.tsx" \
  "$S/features/Brienz" "$S/features/Lucerne" \
  "$S/assets/audio/background-swiss-keepsakes.mp3" \
  "$S/assets/audio/background-swiss-keepsakes-cover.jpg" docs/background-music
rm -f "$S"/routes/lab.*.tsx

# Upstream's lab pages. Our own design lab (features/lab/brand, loves and story, routes/_guest/lab.*) stays.
git ls-files -z -- "$S/features/lab" "$S/routes" ".impeccable/surfaces" |
  grep -zE "^$S/features/lab/|^$S/routes/lab\.|^\.impeccable/surfaces/.*lab" |
  grep -zvE "^$S/features/lab/(brand|loves|story)/" |
  xargs -0 -r git rm -q --cached --ignore-unmatch -- || true
find "$S/features/lab" -mindepth 1 -maxdepth 1 ! -name brand ! -name loves ! -name story -exec rm -rf {} + 2>/dev/null || true
rm -f .impeccable/surfaces/*lab*

# Upstream's back-end, keepsake e2e flows, planning docs and home rework (see UPSTREAM-SYNC.md).
git rm -rq --ignore-unmatch --cached -- api e2e spikes package.json .github docs/spikes docs/architecture \
  docs/development-plan docs/front-end-audit docs/development-rules AGENTS.md scripts/trace.mjs \
  scripts/trace.test.mjs scripts/fixtures scripts/REPORT-E0.9.md "$S/components/assistant.tsx" \
  "$S/features/discovery/components/journey-steps.tsx" "$S/features/discovery/components/moving-story-rail.tsx" \
  "$S/features/discovery/components/part-heading.tsx" "$S/features/discovery/components/snowfall.tsx" \
  "$S/features/discovery/components/story-categories.tsx" 2>/dev/null || true
rm -rf api e2e spikes .github docs/spikes docs/architecture docs/development-plan docs/front-end-audit \
  docs/development-rules AGENTS.md package.json scripts/trace.mjs scripts/trace.test.mjs scripts/fixtures \
  scripts/REPORT-E0.9.md "$S/components/assistant.tsx" \
  "$S/features/discovery/components/journey-steps.tsx" "$S/features/discovery/components/moving-story-rail.tsx" \
  "$S/features/discovery/components/part-heading.tsx" "$S/features/discovery/components/snowfall.tsx" \
  "$S/features/discovery/components/story-categories.tsx"

echo "Pruned. Next: resolve the remaining conflicts, then run tsc, eslint and vite build."
