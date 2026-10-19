import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LazyBookingSheet, preloadBookingSheet } from '@/features/tours/discovery/lazy-booking-sheet'

const chunk = vi.hoisted(() => ({ fails: true }))

vi.mock('@/features/tours/discovery/listing-booking-sheet', () => {
  if (chunk.fails)
    throw new Error('Failed to fetch dynamically imported module')

  return { ListingBookingSheet: () => <p>sheet</p> }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('lazy booking sheet', () => {
  it('closes again when the chunk fails, and opens on the next tap', async () => {
    const onClose = vi.fn()
    const unhandled = vi.fn()

    process.on('unhandledRejection', unhandled)

    await act(async () => {
      preloadBookingSheet()
    })

    const view = render(<LazyBookingSheet isOpen kind="stay" onClose={onClose} />)

    await act(async () => {})
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('sheet')).not.toBeInTheDocument()
    expect(unhandled).not.toHaveBeenCalled()

    chunk.fails = false
    view.rerender(<LazyBookingSheet isOpen={false} kind="stay" onClose={onClose} />)
    await act(async () => {
      view.rerender(<LazyBookingSheet isOpen kind="stay" onClose={onClose} />)
    })

    expect(screen.getByText('sheet')).toBeInTheDocument()
    expect(onClose).toHaveBeenCalledTimes(1)
    process.off('unhandledRejection', unhandled)
  })
})
