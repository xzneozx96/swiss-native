/**
 * Throwaway design lab (#/lab/loves): five ideas for Erich's three loves (Motors, Travel,
 * Homeland), the moment right after his introduction on the story home. A switcher picks
 * idea and language; each idea sits in a home-like column between the intro and the
 * tours chapter. The real home does not show this block until an idea is chosen.
 */
import type { LovesLanguage } from './copy'
import type { IDEA_COUNT } from './counts'

import { Link } from '@tanstack/react-router'

import { storyCopy } from '@/features/discovery/story-copy'

import { photoUrl } from '@/lib/photos'
import { labChrome, lovesCopy } from './copy'
import { IdeaOdometer } from './idea-odometer'
import { IdeaPhotos } from './idea-photos'
import { IdeaSentence } from './idea-sentence'
import { IdeaStamps } from './idea-stamps'

import { IdeaTags } from './idea-tags'
import './loves.css'

export interface LovesSearch {
  idea: number
  lang: LovesLanguage
}

const IDEAS = [
  IdeaTags,
  IdeaStamps,
  IdeaPhotos,
  IdeaSentence,
  IdeaOdometer,
] as const satisfies { length: typeof IDEA_COUNT }

function Segment<T extends string | number>({
  label,
  value,
  options,
  field,
  search,
}: {
  label: string
  value: T
  options: { value: T, label: string }[]
  field: keyof LovesSearch
  search: LovesSearch
}) {
  return (
    <div
      aria-label={label}
      className="flex flex-1 gap-1 rounded-full bg-default p-1"
      role="group"
    >
      {options.map(o => (
        <Link
          key={String(o.value)}
          replace
          aria-current={o.value === value ? 'true' : undefined}
          className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-2 text-[13px] font-semibold outline-none focus-visible:focus-ring ${
            o.value === value
              ? 'bg-surface text-foreground shadow-surface'
              : 'text-muted'
          }`}
          search={{ ...search, [field]: o.value }}
          to="/lab/loves"
        >
          {o.label}
        </Link>
      ))}
    </div>
  )
}

export function LabLoves({ search }: { search: LovesSearch }) {
  const t = labChrome[search.lang]
  const story = storyCopy[search.lang]
  const Idea = IDEAS[search.idea - 1]
  const letter = String.fromCharCode(64 + search.idea)

  return (
    <div lang={search.lang}>
      <div className="flex flex-col gap-2 border-b border-separator bg-surface px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3">
        <h1 className="text-[15px] leading-5 font-semibold">{t.title}</h1>
        <div className="flex items-center gap-2">
          <Segment
            field="idea"
            label={t.idea}
            options={IDEAS.map((_, i) => ({
              value: i + 1,
              label: String.fromCharCode(65 + i),
            }))}
            search={search}
            value={search.idea}
          />
          <div className="w-28 shrink-0">
            <Segment
              field="lang"
              label={t.language}
              options={[
                { value: 'en' as LovesLanguage, label: 'EN' },
                { value: 'de' as LovesLanguage, label: 'DE' },
              ]}
              search={search}
              value={search.lang}
            />
          </div>
        </div>
        <p className="text-[13px] leading-[18px] text-muted">
          <span className="font-semibold text-foreground">
            {letter} · {t.names[search.idea - 1]}{' '}
          </span>
          {t.notes[search.idea - 1]}
        </p>
      </div>

      <div className="mx-auto flex max-w-[430px] flex-col gap-10 bg-[#fbfbfa] px-4 pt-8 pb-16">
        <div className="flex flex-col gap-4 opacity-55">
          <p className="font-serif text-[24px] leading-9 text-balance">
            {story.lede}
          </p>
          <p className="font-serif text-[17px] leading-7 text-foreground/85">
            {story.body}
          </p>
        </div>

        <div key={`${search.idea}${search.lang}`}>
          <Idea c={lovesCopy[search.lang]} />
        </div>

        <div aria-hidden className="flex flex-col gap-3 opacity-55">
          <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            {story.chapters.tours.kicker} · {story.chapters.tours.label}
          </span>
          <p className="font-serif text-[26px] leading-8">
            {story.chapters.tours.title}
          </p>
          <img
            alt=""
            className="aspect-[16/9] w-full rounded-3xl object-cover"
            src={photoUrl('furka-pass-4')}
          />
          <p className="text-xs text-muted italic">{t.context}</p>
        </div>
      </div>
    </div>
  )
}
