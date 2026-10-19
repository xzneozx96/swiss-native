import type { LabSearch } from '@/features/lab/brand/lab-brand'

import { createFileRoute } from '@tanstack/react-router'

import { ideaCount, LabBrand } from '@/features/lab/brand/lab-brand'

// Throwaway design lab: brand blocks from the client's banner (USP strip, quote).
export const Route = createFileRoute('/_guest/lab/brand')({
  validateSearch: (search: Record<string, unknown>): LabSearch => {
    const piece = search.piece === 'quote' ? 'quote' : 'usp'
    const idea = Number(search.idea)

    return {
      piece,
      idea:
        Number.isInteger(idea) && idea >= 1 && idea <= ideaCount(piece)
          ? idea
          : 1,
      lang: search.lang === 'de' ? 'de' : 'en',
      ctx: [true, 1, '1', 'true'].includes(search.ctx as never),
    }
  },
  component: LabBrandPage,
})

function LabBrandPage() {
  return <LabBrand search={Route.useSearch()} />
}
