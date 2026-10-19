import { useReveal } from '@/hooks/use-reveal'

const ROAD = 'M60 0 C60 14 20 14 20 28 S100 42 100 56 S60 70 60 88'

/**
 * The link between two chapters of the story home: a line in Erich's voice, then a
 * winding mountain road with a dot that rides it once and stops on a pin. The band
 * blends the colour of the chapter above into the one below. Its negative margin
 * cancels the page's gap (gap-10) so the band meets both chapters edge to edge.
 */
export function ChapterConnector({
  kicker,
  line,
  from,
  to,
  dark = false,
}: {
  kicker: string
  line: string
  from: string
  to: string
  dark?: boolean
}) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`-mx-4 -my-10 flex flex-col items-center gap-4 px-8 pt-12 pb-8 text-center ${dark ? 'text-white' : 'text-foreground'}`}
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    >
      <div className="reveal flex max-w-xs flex-col gap-1.5">
        <span
          className={`text-xs font-semibold tracking-[0.16em] uppercase ${dark ? 'text-white/70' : 'text-muted'}`}
        >
          {kicker}
        </span>
        <p className="font-serif text-[20px] leading-7 text-balance">{line}</p>
      </div>
      <div aria-hidden className="relative h-[88px] w-[120px]">
        <svg className="absolute inset-0" fill="none" viewBox="0 0 120 88">
          <path
            className={dark ? 'stroke-white/45' : 'stroke-foreground/35'}
            d={ROAD}
            strokeDasharray="1 8"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <circle
            cx="60"
            cy="88"
            fill="#E3352A"
            r="5"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
        <span className="road-dot absolute top-0 left-0 size-3 rounded-full bg-[#E3352A] shadow-[0_0_0_3px_rgba(227,53,42,0.25)]" />
      </div>
    </div>
  )
}
