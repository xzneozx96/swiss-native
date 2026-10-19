import { Link } from '@tanstack/react-router'

import { BackIcon, SearchIcon } from '@/components/icons'

const roundAction
  = 'flex size-11 items-center justify-center rounded-full outline-none transition-transform focus-visible:focus-ring active:scale-95'

/**
 * "floating" sits on a banner (white pill with shadow); "pill" sits on a photo (the tour
 * card's pill, owner request); "glass" is a frosted glass; "bar" sits in the compact bar.
 */
type ActionTone = 'floating' | 'pill' | 'glass' | 'bar'

const toneClass: Record<ActionTone, string> = {
  floating: 'bg-surface/90 text-foreground shadow-surface backdrop-blur',
  pill: 'pill',
  glass: 'glass',
  bar: 'bg-transparent text-foreground',
}

/**
 * Round search action. On the discovery home it opens global search (`to`); on a list
 * screen it opens search scoped to that screen (`onPress`).
 */
export function SearchButton({
  tone = 'floating',
  label,
  to,
  onPress,
}: {
  tone?: ActionTone
  label: string
  to?: '/search'
  onPress?: () => void
}) {
  const className = `${roundAction} ${toneClass[tone]}`

  if (to) {
    return (
      <Link aria-label={label} className={className} to={to}>
        <SearchIcon size={22} />
      </Link>
    )
  }

  return (
    <button
      aria-label={label}
      className={className}
      type="button"
      onClick={onPress}
    >
      <SearchIcon size={22} />
    </button>
  )
}

/** Round back action for a search bar or sub-screen top bar; 44px touch target. */
export function BackButton({
  label,
  onPress,
  tone = 'bar',
}: {
  label: string
  onPress: () => void
  tone?: ActionTone
}) {
  return (
    <button
      aria-label={label}
      className={`${roundAction} shrink-0 ${tone === 'bar' ? '-ms-2' : ''} ${toneClass[tone]}`}
      type="button"
      onClick={onPress}
    >
      <BackIcon size={22} />
    </button>
  )
}

/**
 * Collapsing header (iOS large-title pattern): hidden while the screen's own banner is
 * in view, then fades in pinned to the top with the screen name and its actions.
 * Without a title, the children fill the bar (search mode: ← back + field). `leading`
 * goes before the title (← back on detail screens).
 * Fixed inside the 430px app frame (no left/right set, so it keeps the frame's position).
 */
export function CompactBar({
  title,
  visible,
  leading,
  children,
}: {
  title?: string
  visible: boolean
  leading?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed top-0 z-30 w-full max-w-[430px] border-b border-separator/70 bg-background/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl transition-[opacity,translate] duration-200 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0'
      }`}
      data-visible={visible}
      inert={!visible}
    >
      <div className="flex h-14 items-center gap-2 ps-4 pe-2">
        {leading}
        {title !== undefined && (
          <span className="min-w-0 flex-1 truncate font-serif text-card-title">
            {title}
          </span>
        )}
        {children}
      </div>
    </div>
  )
}
