import type { ChapterId, StoryCopy } from './copy'

import { buttonVariants } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { ChevronRightIcon } from '@/components/icons'

import { BrandLogo } from '@/components/layout/brand-logo'
import { CompactBar, SearchButton } from '@/components/layout/top-bar-buttons'
import { Rail } from '@/features/discovery/components/section'
import { useDiscoveryView } from '@/features/discovery/hooks/use-discovery-view'
import { TourCard } from '@/features/tours/discovery/tour-card'
import { useReveal } from '@/hooks/use-reveal'
import { photoUrl } from '@/lib/photos'
import { CHAPTERS, PASSES } from './copy'

export const chapterId = (id: ChapterId) => `story-${id}`

/** Fades and lifts its content in once, the first time it comes into view. */
export function Reveal({
  className = '',
  delay = 0,
  children,
}: {
  className?: string
  delay?: number
  children: React.ReactNode
}) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export function Photo({
  slug,
  alt,
  className = '',
}: {
  slug: string
  alt: string
  className?: string
}) {
  return (
    <img
      alt={alt}
      className={`object-cover ${className}`}
      decoding="async"
      loading="lazy"
      src={photoUrl(slug)}
    />
  )
}

/** Logo and search in one row; `tone` matches what the row sits on. */
export function TopRow({
  c,
  tone = 'floating',
}: {
  c: StoryCopy
  tone?: 'floating' | 'glass'
}) {
  return (
    <div className="flex h-12 items-center gap-2">
      <div className="min-w-0 flex-1">
        <BrandLogo label={c.name} />
      </div>
      <SearchButton label={c.searchLabel} to="/search" tone={tone} />
    </div>
  )
}

export function StoryBar({ c, visible }: { c: StoryCopy, visible: boolean }) {
  return (
    <CompactBar visible={visible}>
      <div className="min-w-0 flex-1">
        <BrandLogo compact label={c.name} />
      </div>
      <SearchButton label={c.searchLabel} to="/search" tone="bar" />
    </CompactBar>
  )
}

export function VoiceNote({
  c,
  className = '',
}: {
  c: StoryCopy
  className?: string
}) {
  return (
    <p className={`text-xs leading-4 italic opacity-70 ${className}`}>
      {c.voiceNote}
    </p>
  )
}

export function scrollToChapter(id: ChapterId) {
  document
    .getElementById(chapterId(id))
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** The three offers as a contents list; each row scrolls to its chapter. */
export function Contents({
  c,
  numeral,
  dark = false,
}: {
  c: StoryCopy
  numeral: (n: string) => React.ReactNode
  dark?: boolean
}) {
  return (
    <nav aria-label={c.tocTitle} className="flex flex-col gap-1">
      <h2
        className={`text-xs font-semibold tracking-[0.14em] uppercase ${dark ? 'text-white/70' : 'text-muted'}`}
      >
        {c.tocTitle}
      </h2>
      <ul
        className={`flex flex-col divide-y ${dark ? 'divide-white/20' : 'divide-separator'}`}
      >
        {CHAPTERS.map((id) => {
          const ch = c.chapters[id]

          return (
            <li key={id}>
              <button
                className="flex min-h-14 w-full items-center gap-3 rounded-lg text-start outline-none focus-visible:focus-ring active:opacity-60"
                type="button"
                onClick={() => scrollToChapter(id)}
              >
                {numeral(ch.n)}
                <span className="min-w-0 flex-1 font-serif text-card-title">
                  {ch.label}
                </span>
                <span
                  className={`shrink-0 text-xs ${dark ? 'text-white/70' : 'text-muted'}`}
                >
                  {ch.when}
                </span>
                <ChevronRightIcon className="shrink-0 opacity-60" size={16} />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** The five passes with heights and one line each, as a snap row of photo cards. */
export function PassStrip({ c }: { c: StoryCopy }) {
  const lines = c.chapters.tours.lines

  return (
    <Rail label="Furka, Grimsel, Susten, Gotthard, Nufenen">
      {PASSES.map(p => (
        <li
          key={p.name}
          className="relative w-44 shrink-0 snap-start overflow-hidden rounded-2xl"
        >
          <Photo alt="" className="aspect-[3/4] w-full" slug={p.photo} />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-3 text-white">
            <span className="font-script text-[28px] leading-7">{p.name}</span>
            <span className="text-xs font-semibold tabular-nums">
              {p.m.toLocaleString('de-CH')} m
            </span>
            <span className="mt-1 text-xs leading-4 text-white/85">
              {lines[p.name]}
            </span>
          </div>
        </li>
      ))}
    </Rail>
  )
}

/** The bookable tours, as on the current home, with "See all tours". */
export function ToursRail({ c }: { c: StoryCopy }) {
  const { tours } = useDiscoveryView()

  return (
    <div className="flex flex-col gap-3">
      <Rail label={c.chapters.tours.label}>
        {tours.items.map(item => (
          <li key={item.id}>
            <TourCard layout="carousel" tour={item} />
          </li>
        ))}
      </Rail>
      <Link
        className={`${buttonVariants({ variant: 'secondary' })} self-start`}
        to="/tours"
      >
        {c.chapters.tours.cta}
        <ChevronRightIcon size={16} />
      </Link>
    </div>
  )
}
