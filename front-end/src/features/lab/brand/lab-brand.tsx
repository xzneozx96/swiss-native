/**
 * Throwaway design lab (#/lab/brand) for two home-page blocks from the client's banner:
 * the USP strip and the handwritten quote. A switcher picks piece, idea and language;
 * "In context" renders the idea inside the real home-page stack at its recommended spot.
 */
import type { BrandCopy, LabLanguage } from './copy'
import type { IDEA_COUNT } from './counts'
import type { Round2Copy } from './round2-copy'

import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { useLocale } from '@/contexts/locale-context'
import { AdviceBanner } from '@/features/discovery/components/advice-banner'

import { ExperienceFlight } from '@/features/discovery/components/experience-flight'
import { Hero } from '@/features/discovery/components/hero'
import { Rail, Section } from '@/features/discovery/components/section'
import { StayKey } from '@/features/discovery/components/stay-key'
import { useDiscoveryView } from '@/features/discovery/hooks/use-discovery-view'
import { TourCard } from '@/features/tours/discovery/tour-card'

import { brandCopy, labChrome } from './copy'
import {
  QuoteFaithful,
  QuotePhoto,
  QuotePostcard,
  QuotePull,
} from './quote-ideas'
import {
  QuoteAirmail,
  QuoteBack,
  QuoteFlip,
  QuoteKraft,
  QuoteNotepad,
  QuotePolaroid,
} from './quote-postcards'
import { round2Copy } from './round2-copy'
import {
  UspFaithful,
  UspJump,
  UspPills,
  UspRoad,
  UspTicker,
} from './usp-ideas'
import {
  UspRoadHairpin,
  UspRoadRide,
  UspRoadRidge,
  UspRoadSignpost,
  UspRoadTopo,
  UspRoadVertical,
} from './usp-roads'
import './brand.css'
import './round2.css'

export type Piece = 'usp' | 'quote'

export interface LabSearch {
  piece: Piece
  idea: number
  lang: LabLanguage
  ctx: boolean
}

type Slot
  = | 'hero-edge'
    | 'after-hero'
    | 'after-tours'
    | 'after-stay'
    | 'after-experience'

interface Idea {
  name: { en: string, de: string }
  note: { en: string, de: string }
  slot: Slot
  render: (c: BrandCopy, inContext: boolean, r: Round2Copy) => React.ReactNode
}

const slotName: Record<Slot, { en: string, de: string }> = {
  'hero-edge': {
    en: 'Tucked under the hero\'s search box',
    de: 'Unter dem Suchfeld des Heros',
  },
  'after-hero': { en: 'Under the hero', de: 'Unter dem Hero' },
  'after-tours': {
    en: 'Between Tours and Stay',
    de: 'Zwischen Touren und Übernachten',
  },
  'after-stay': {
    en: 'Between Stay and Experience',
    de: 'Zwischen Übernachten und Erlebnis',
  },
  'after-experience': {
    en: 'Before the closing card',
    de: 'Vor der Schlusskarte',
  },
}

const IDEAS: { [P in Piece]: Idea[] & { length: (typeof IDEA_COUNT)[P] } } = {
  usp: [
    {
      name: { en: 'Faithful strip', de: 'Getreue Leiste' },
      note: {
        en: 'Banner as is: three icon columns, hairline dividers, cream.',
        de: 'Banner wie gehabt: drei Icon-Spalten, feine Trennlinien, Creme.',
      },
      slot: 'after-hero',
      render: c => <UspFaithful c={c} />,
    },
    {
      name: { en: 'Pill cards', de: 'Pillen-Karten' },
      note: {
        en: 'Scroll-snap row, one descriptive line per point.',
        de: 'Scroll-Snap-Reihe, eine beschreibende Zeile je Punkt.',
      },
      slot: 'after-hero',
      render: c => <UspPills c={c} />,
    },
    {
      name: { en: 'Ticker line', de: 'Tickerzeile' },
      note: {
        en: 'One low line; the search box rests on it.',
        de: 'Eine niedrige Zeile; das Suchfeld liegt darauf.',
      },
      slot: 'hero-edge',
      render: (c, inContext) => <UspTicker c={c} heroEdge={inContext} />,
    },
    {
      name: { en: 'Jump chips', de: 'Sprung-Chips' },
      note: {
        en: 'Tap a point to jump to Tours, Stay or Experience.',
        de: 'Punkt antippen: springt zu Touren, Übernachten oder Erlebnis.',
      },
      slot: 'after-hero',
      render: c => <UspJump c={c} />,
    },
    {
      name: { en: 'Road line', de: 'Strassenlinie' },
      note: {
        en: 'A winding road links the three points like stops.',
        de: 'Eine kurvige Strasse verbindet die drei Punkte wie Etappen.',
      },
      slot: 'after-hero',
      render: c => <UspRoad c={c} />,
    },
    {
      name: { en: 'Vertical road', de: 'Senkrechte Strasse' },
      note: {
        en: 'Road down the left, a stop and a line per point; fades into Tours.',
        de: 'Strasse links abwärts, je Punkt ein Halt und eine Zeile; läuft in Touren aus.',
      },
      slot: 'after-hero',
      render: (c, _, r) => <UspRoadVertical c={c} r={r} />,
    },
    {
      name: { en: 'The ride', de: 'Die Fahrt' },
      note: {
        en: 'Road draws itself once; a red dot rides along and lights each stop.',
        de: 'Strasse zeichnet sich einmal; ein roter Punkt fährt mit und weckt jeden Halt.',
      },
      slot: 'after-hero',
      render: (c, _, r) => <UspRoadRide c={c} r={r} />,
    },
    {
      name: { en: 'Switchbacks', de: 'Kehren' },
      note: {
        en: 'Hairpin road; each point an enamel sign inside a bend.',
        de: 'Kehrenstrasse; jeder Punkt ein Emailschild in einer Kurve.',
      },
      slot: 'after-hero',
      render: (c, _, r) => <UspRoadHairpin c={c} r={r} />,
    },
    {
      name: { en: 'Over the ridge', de: 'Über den Grat' },
      note: {
        en: 'A thin ridge; the road climbs to a saddle at each point.',
        de: 'Ein feiner Grat; die Strasse steigt bei jedem Punkt auf einen Sattel.',
      },
      slot: 'after-hero',
      render: (c, _, r) => <UspRoadRidge c={c} r={r} />,
    },
    {
      name: { en: 'Signpost', de: 'Wegweiser' },
      note: {
        en: 'Yellow Swiss trail signs on one post, above the winding road.',
        de: 'Gelbe Wanderwegweiser an einem Pfosten, über der kurvigen Strasse.',
      },
      slot: 'after-hero',
      render: (c, _, r) => <UspRoadSignpost c={c} r={r} />,
    },
    {
      name: { en: 'Map piece', de: 'Kartenstück' },
      note: {
        en: 'Topographic scrap: contours, dashed route, three stops, pass names.',
        de: 'Topografisches Stück: Höhenlinien, gestrichelte Route, drei Halte, Passnamen.',
      },
      slot: 'after-hero',
      render: (c, _, r) => <UspRoadTopo c={c} r={r} />,
    },
  ],
  quote: [
    {
      name: { en: 'Faithful note', de: 'Getreue Notiz' },
      note: {
        en: 'Script on cream, red heart, small round photo of the house.',
        de: 'Handschrift auf Creme, rotes Herz, kleines rundes Hausfoto.',
      },
      slot: 'after-tours',
      render: c => <QuoteFaithful c={c} />,
    },
    {
      name: { en: 'Pull quote', de: 'Grosses Zitat' },
      note: {
        en: 'Centred serif, oversized red quotation mark, Erich\'s name.',
        de: 'Zentrierte Serifenschrift, grosses rotes Anführungszeichen, Erichs Name.',
      },
      slot: 'after-experience',
      render: c => <QuotePull c={c} />,
    },
    {
      name: { en: 'Postcard', de: 'Postkarte' },
      note: {
        en: 'Handwritten on a turned card with stamp, postmark and pines.',
        de: 'Handgeschrieben auf einer gedrehten Karte mit Marke, Stempel und Tannen.',
      },
      slot: 'after-tours',
      render: c => <QuotePostcard c={c} />,
    },
    {
      name: { en: 'Photo scrim', de: 'Foto mit Verlauf' },
      note: {
        en: 'Full-bleed chalet photo, script on a soft dark scrim.',
        de: 'Randloses Chaletfoto, Handschrift auf weichem dunklem Verlauf.',
      },
      slot: 'after-tours',
      render: c => <QuotePhoto c={c} />,
    },
    {
      name: {
        en: 'Kraft, taped, leaning',
        de: 'Kraftpapier, geklebt, angelehnt',
      },
      note: {
        en: 'Light kraft card, red washi tape; leans over the Stay card.',
        de: 'Helles Kraftpapier, rotes Washi-Tape; lehnt an der Übernachten-Karte.',
      },
      slot: 'after-tours',
      render: (c, inContext, r) => (
        <QuoteKraft c={c} inContext={inContext} r={r} />
      ),
    },
    {
      name: { en: 'Polaroid', de: 'Polaroid' },
      note: {
        en: 'Photo of the house; the quote written on the white margin.',
        de: 'Foto des Hauses; das Zitat auf dem weissen Rand.',
      },
      slot: 'after-tours',
      render: (c, _, r) => <QuotePolaroid c={c} r={r} />,
    },
    {
      name: { en: 'Flip card', de: 'Wendekarte' },
      note: {
        en: 'Photo side first (Entlebuch); tap to turn to the handwriting.',
        de: 'Zuerst die Fotoseite (Entlebuch); tippen dreht zur Handschrift.',
      },
      slot: 'after-tours',
      render: (c, _, r) => <QuoteFlip c={c} r={r} />,
    },
    {
      name: { en: 'Back of the card', de: 'Kartenrückseite' },
      note: {
        en: 'Printed reverse: header, frame, stamp, Finsterwald postmark, address lines.',
        de: 'Gedruckte Rückseite: Kopfzeile, Rahmen, Marke, Stempel Finsterwald, Adresslinien.',
      },
      slot: 'after-tours',
      render: (c, _, r) => <QuoteBack c={c} r={r} />,
    },
    {
      name: { en: 'Notepad page', de: 'Notizblatt' },
      note: {
        en: 'Lined page torn from a pad, red margin, red pushpin.',
        de: 'Liniertes Blatt vom Block gerissen, roter Rand, rote Pinnnadel.',
      },
      slot: 'after-tours',
      render: (c, _, r) => <QuoteNotepad c={c} r={r} />,
    },
    {
      name: { en: 'Airmail, written live', de: 'Luftpost, live geschrieben' },
      note: {
        en: 'Airmail border; the words appear one by one on first view.',
        de: 'Luftpostrand; die Wörter erscheinen beim ersten Anblick einzeln.',
      },
      slot: 'after-tours',
      render: (c, _, r) => <QuoteAirmail c={c} r={r} />,
    },
  ],
}

function Segment<T extends string | number | boolean>({
  label,
  value,
  options,
  search,
  field,
  compact = false,
  grid = false,
}: {
  compact?: boolean
  /** Many options: two rows of six, so each stays 44px wide at 360. */
  grid?: boolean
  label: string
  value: T
  options: { value: T, label: string }[]
  search: LabSearch
  field: keyof LabSearch
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`shrink-0 text-[12px] leading-4 font-semibold text-muted ${compact ? 'sr-only' : 'w-[52px]'}`}
      >
        {label}
      </span>
      <div
        aria-label={label}
        className={`flex-1 gap-1 bg-default p-1 ${grid ? 'grid grid-cols-6 rounded-3xl' : 'flex rounded-full'}`}
        role="group"
      >
        {options.map((o) => {
          const next = { ...search, [field]: o.value }

          if (field === 'piece')
            next.idea = 1

          return (
            <Link
              key={String(o.value)}
              replace
              aria-current={o.value === value ? 'true' : undefined}
              className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-2 text-[13px] font-semibold outline-none focus-visible:focus-ring ${
                o.value === value
                  ? 'bg-surface text-foreground shadow-surface'
                  : 'text-muted'
              }`}
              search={next}
              to="/lab/brand"
            >
              {o.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Controls({ search }: { search: LabSearch }) {
  const t = labChrome[search.lang]
  const idea = IDEAS[search.piece][search.idea - 1]

  return (
    <div className="flex flex-col gap-1.5 border-b border-separator bg-surface px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3">
      <h1 className="text-[15px] leading-5 font-semibold">{t.title}</h1>
      <Segment
        field="piece"
        label={t.piece}
        options={[
          { value: 'usp' as Piece, label: t.usp },
          { value: 'quote' as Piece, label: t.quote },
        ]}
        search={search}
        value={search.piece}
      />
      <Segment
        compact
        field="idea"
        grid={IDEAS[search.piece].length > 6}
        label={t.idea}
        options={IDEAS[search.piece].map((_, i) => ({
          value: i + 1,
          label: String(i + 1),
        }))}
        search={search}
        value={search.idea}
      />
      <div className="grid grid-cols-2 gap-3">
        <Segment
          compact
          field="lang"
          label={t.language}
          options={[
            { value: 'en' as LabLanguage, label: 'EN' },
            { value: 'de' as LabLanguage, label: 'DE' },
          ]}
          search={search}
          value={search.lang}
        />
        <Segment
          compact
          field="ctx"
          label={t.context}
          options={[
            { value: false, label: t.page },
            { value: true, label: t.contextShort },
          ]}
          search={search}
          value={search.ctx}
        />
      </div>
      <p className="text-[13px] leading-[18px]">
        <span className="font-semibold">
          {search.idea} · {idea.name[search.lang]}
        </span>
        {' '}
        <span className="text-muted">{idea.note[search.lang]}</span>
      </p>
      <p className="text-[12px] leading-4 text-muted">
        {t.position}: {slotName[idea.slot][search.lang]}
      </p>
    </div>
  )
}

/** The real home-page stack with the idea dropped into its slot. */
function InContext({
  idea,
  c,
  r,
}: {
  idea: Idea
  c: BrandCopy
  r: Round2Copy
}) {
  const { hero, tours } = useDiscoveryView()
  const markRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // After the router's own scroll reset and the first layout of the sections.
    const timer = window.setTimeout(
      () => markRef.current?.scrollIntoView({ block: 'center' }),
      400,
    )

    return () => window.clearTimeout(timer)
  }, [idea])

  const at = (slot: Slot) =>
    idea.slot === slot
      ? (
          <div ref={markRef}>{idea.render(c, true, r)}</div>
        )
      : null

  return (
    <div className="flex flex-col gap-9 px-4 pb-4">
      <Hero {...hero} />
      {at('hero-edge')}
      {at('after-hero')}
      <Section
        id="tours"
        seeAll={{ label: tours.seeAll, to: '/tours' }}
        subtitle={tours.subtitle}
        title={tours.title}
      >
        <Rail label={tours.title}>
          {tours.items.map(item => (
            <li key={item.id}>
              <TourCard layout="carousel" tour={item} />
            </li>
          ))}
        </Rail>
      </Section>
      {at('after-tours')}
      <StayKey />
      {at('after-stay')}
      <ExperienceFlight />
      {at('after-experience')}
      <AdviceBanner />
    </div>
  )
}

export function LabBrand({ search }: { search: LabSearch }) {
  const { language, setLanguage } = useLocale()
  const c = brandCopy[search.lang]
  const idea = IDEAS[search.piece][search.idea - 1]

  // The real sections read the app language, so the lab keeps it in step.
  useEffect(() => {
    if (language !== search.lang)
      setLanguage(search.lang)
  }, [language, search.lang, setLanguage])

  return (
    <div lang={search.lang}>
      <Controls search={search} />
      {search.ctx
        ? (
            <InContext
              key={`${search.piece}${search.idea}`}
              c={c}
              idea={idea}
              r={round2Copy[search.lang]}
            />
          )
        : (
            <div
              key={`${search.piece}${search.idea}${search.lang}`}
              className="px-4 py-8"
            >
              {idea.render(c, false, round2Copy[search.lang])}
            </div>
          )}
    </div>
  )
}
