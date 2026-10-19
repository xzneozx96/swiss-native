import type { StorySearch } from '@/features/lab/story/lab-story'

import { createFileRoute } from '@tanstack/react-router'

import {
  CINEMATIC_COUNT,
  DIRECTION_COUNT,
} from '@/features/lab/story/counts'
import { LabStory } from '@/features/lab/story/lab-story'

// Throwaway design lab: the home page as Erich's story, in three directions.
export const Route = createFileRoute('/_guest/lab/story')({
  validateSearch: (search: Record<string, unknown>): StorySearch => {
    const dir = Number(search.dir)
    const v = Number(search.v)

    return {
      dir:
        Number.isInteger(dir) && dir >= 1 && dir <= DIRECTION_COUNT ? dir : 2,
      v: Number.isInteger(v) && v >= 1 && v <= CINEMATIC_COUNT ? v : 1,
      lang: search.lang === 'de' ? 'de' : 'en',
    }
  },
  component: LabStoryPage,
})

function LabStoryPage() {
  return <LabStory search={Route.useSearch()} />
}
