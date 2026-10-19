import type { ComponentProps } from 'react'
import type { ListingBookingSheet } from './listing-booking-sheet'

import { useEffect, useState } from 'react'

type SheetProps = ComponentProps<typeof ListingBookingSheet>
type SheetComponent = typeof ListingBookingSheet

let pending: Promise<SheetComponent> | undefined

/** The sheet's chunk. A failed fetch is forgotten, so the next call tries again. */
function loadBookingSheet(): Promise<SheetComponent> {
  pending ??= import('./listing-booking-sheet').then(
    module => module.ListingBookingSheet,
    (error: unknown) => {
      pending = undefined
      throw error
    },
  )

  return pending
}

/** Starts the download on hover or focus; a failure here is retried when the sheet opens. */
export function preloadBookingSheet() {
  loadBookingSheet().catch(() => undefined)
}

/**
 * The booking sheet, fetched when it is first opened. If the chunk cannot be fetched (offline, or
 * a page left open across a deploy) the sheet closes again and the page keeps working. Browsers
 * remember a failed module fetch for the life of the page, so a reload is what recovers it.
 */
export function LazyBookingSheet(props: SheetProps) {
  const { isOpen, onClose } = props
  const [Sheet, setSheet] = useState<SheetComponent | null>(null)

  useEffect(() => {
    if (!isOpen || Sheet)
      return
    let live = true

    loadBookingSheet().then(
      (component) => {
        if (live)
          setSheet(() => component)
      },
      () => {
        if (live)
          onClose()
      },
    )

    return () => {
      live = false
    }
  }, [isOpen, Sheet, onClose])

  return Sheet ? <Sheet {...props} /> : null
}
