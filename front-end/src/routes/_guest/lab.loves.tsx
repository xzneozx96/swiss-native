import type { LovesSearch } from '@/features/lab/loves/lab-loves'

import { createFileRoute } from '@tanstack/react-router'

import { IDEA_COUNT } from '@/features/lab/loves/counts'
import { LabLoves } from '@/features/lab/loves/lab-loves'

// Throwaway design lab: five ideas for Erich's three loves on the story home.
export const Route = createFileRoute('/_guest/lab/loves')({
  validateSearch: (search: Record<string, unknown>): LovesSearch => {
    const idea = Number(search.idea)

    return {
      idea:
        Number.isInteger(idea) && idea >= 1 && idea <= IDEA_COUNT ? idea : 1,
      lang: search.lang === 'de' ? 'de' : 'en',
    }
  },
  component: LabLovesPage,
})

function LabLovesPage() {
  return <LabLoves search={Route.useSearch()} />
}
