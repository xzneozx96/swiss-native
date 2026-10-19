import type { LinkProps } from '@tanstack/react-router'

import { ScrollShadow } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { ChevronRightIcon } from '@/components/icons'

interface SectionProps {
  id: string
  title: string
  subtitle?: string
  seeAll?: { label: string, to: LinkProps['to'] }
  /** Heading level: 3 when the section sits inside a story chapter. */
  level?: 2 | 3
  children: React.ReactNode
}

/** A titled discovery section with an optional app-style "See all ›" action. */
export function Section({
  id,
  title,
  subtitle,
  seeAll,
  level = 2,
  children,
}: SectionProps) {
  const Heading = level === 3 ? 'h3' : 'h2'

  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <Heading className="text-heading" id={id}>
            {title}
          </Heading>
          {subtitle && <p className="text-label text-muted">{subtitle}</p>}
        </div>
        {seeAll && (
          <Link
            className="flex shrink-0 items-center gap-0.5 rounded-md py-1 text-sm font-medium text-muted outline-none select-none focus-visible:focus-ring active:opacity-60"
            to={seeAll.to}
          >
            {seeAll.label}
            <ChevronRightIcon size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

/**
 * Horizontal card rail. On phones it runs to the screen edges (cancelling the 16px
 * gutter) so the next card peeks in; HeroUI ScrollShadow fades the edges.
 */
export function Rail({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <ScrollShadow
      hideScrollBar
      aria-label={label}
      className="-mx-4"
      orientation="horizontal"
      role="region"
      size={24}
    >
      <ul className="flex snap-x snap-mandatory gap-3 px-4 pb-2">{children}</ul>
    </ScrollShadow>
  )
}
