import { act, render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useMessages } from '@/contexts/locale-context'
import { en } from '@/i18n/en'

const german = vi.hoisted(() => ({ fails: true }))
const key = Object.keys(en)[0] as keyof typeof en

vi.mock('@/i18n/de', async () => {
  const { en: english } = await import('@/i18n/en')

  if (german.fails)
    throw new Error('Failed to fetch dynamically imported module')

  return { de: { ...english, [Object.keys(english)[0]]: 'Deutsch' } }
})

afterEach(() => {
  vi.restoreAllMocks()
})

function Row() {
  return <p data-testid="row">{useMessages('de')[key]}</p>
}

function renderRow() {
  return render(
    <Suspense fallback={<p>loading</p>}>
      <Row />
    </Suspense>,
  )
}

describe('useMessages', () => {
  it('shows English when German cannot be fetched, and tries German again later', async () => {
    const realNow = Date.now()
    const now = vi.spyOn(Date, 'now').mockReturnValue(realNow)

    let view!: ReturnType<typeof render>

    await act(async () => {
      view = renderRow()
    })
    expect(screen.getByTestId('row')).toHaveTextContent(en[key])
    view.unmount()

    german.fails = false
    await act(async () => {
      view = renderRow()
    })
    expect(screen.getByTestId('row')).toHaveTextContent(en[key])
    view.unmount()

    now.mockReturnValue(realNow + 11_000)
    await act(async () => {
      renderRow()
    })
    expect(screen.getByTestId('row')).toHaveTextContent('Deutsch')
  })
})
