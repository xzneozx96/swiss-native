import type { Tour } from '../types'

import { useCanGoBack, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { ChoiceSheet } from '@/components/choice-sheet'
import { EmptyState } from '@/components/empty-state'
import { InfoIcon, TourIcon } from '@/components/icons'
import { useLocale } from '@/contexts/locale-context'
import { zurichDate } from '@/features/catalog/lib/pickup'
import {
  DeparturePicker,
  PickerSummary,
} from '@/features/tours/discovery/listing-picker/departure-picker'
import {
  usePickerFormat,
  useSlotChoice,
  useSlotModel,
} from '@/features/tours/discovery/listing-picker/model'
import { useTourActions, useTours } from '@/features/tours/hooks/use-tours'
import {
  availableSeats,
  firstPaymentAmount,
  nextAvailableDeparture,
  participantSeats,
  tourTotal,
  upcomingDepartures,
} from '@/features/tours/lib/selectors'
import {
  dateTimeFormat,
  formatMoney,
  formatShortDate,
  pluralCategory,
} from '@/lib/format'
import { pickText } from '@/lib/localized'

declare module '@tanstack/history' {
  interface HistoryState {
    /** C10 opened over C09's own entry: closing the sheet steps back to it, never adds one. */
    bookOverDetail?: boolean
  }
}

function useTourSelection(tour: Tour, isOpen: boolean) {
  const { t, intlLocale } = useLocale()
  const { data, draft, now } = useTours()
  const { updateDraft } = useTourActions()
  const choices = upcomingDepartures(data, tour.id, now)
  const first = nextAvailableDeparture(data, tour.id, now)
  const changingTour = draft.tourId !== tour.id
  const departureId = changingTour ? (first?.id ?? '') : draft.departureId
  const group = changingTour ? { adults: 2, children: 1, infants: 0 } : draft
  const selected = choices.find(departure => departure.id === departureId)
  const seats = selected ? availableSeats(data, selected.id, now) : 0
  const usedSeats = participantSeats(group)
  const overCapacity = usedSeats > seats
  const valid
    = Boolean(selected) && seats > 0 && !overCapacity && group.adults >= 1
  const total = tourTotal(tour, group)
  const dueToday = selected ? firstPaymentAmount(selected.policy, total) : 0
  const money = (rappen: number) => formatMoney(rappen / 100, intlLocale)

  // Only an open sheet starts a draft for this tour: viewing C09 keeps another tour's draft.
  useEffect(() => {
    if (isOpen && draft.tourId !== tour.id) {
      updateDraft({
        tourId: tour.id,
        departureId: first?.id ?? '',
        nightIds: undefined,
        adults: 2,
        children: 1,
        infants: 0,
      })
    }
  }, [isOpen, draft.tourId, tour.id, first?.id, updateDraft])

  return {
    departureId,
    group,
    selected,
    valid,
    total,
    dueToday,
    money,
    reviewLabel: t('tourDiscovery.review', { total: money(total) }),
  }
}

type TourSelection = ReturnType<typeof useTourSelection>

/**
 * The shared departure picker over the tour's draft: the grid picks the day, the day's
 * departure (or one of its times) the departure; seats are counted as a tour counts them.
 */
function useTourPicker(tour: Tour, selection: TourSelection) {
  const { t, intlLocale } = useLocale()
  const { updateDraft } = useTourActions()
  const model = useSlotModel(tour)
  const plural = (count: number) =>
    pluralCategory(intlLocale, count) === 'one' ? 'one' : 'other'
  const f = usePickerFormat(model.today, {
    seatsLeft: n =>
      n === 0
        ? t('tourDiscovery.soldOut')
        : t(`tourDiscovery.available.${plural(n)}`, { count: n }),
  })
  const choice = useSlotChoice(model, f, {
    group: selection.group,
    setGroup: ({ adults, children, infants }) =>
      updateDraft({ adults, children, infants }),
    slotId: selection.departureId,
    setSlotId: departureId => updateDraft({ departureId }),
  })

  return { model, f, choice }
}

type TourPicker = ReturnType<typeof useTourPicker>

/** The sheet's content: the departure picker, then what the chosen departure costs and when. */
function TourSelectionBody({
  selection,
  picker,
}: {
  selection: TourSelection
  picker: TourPicker
}) {
  const { t, intlLocale } = useLocale()
  const { now } = useTours()
  const { selected, total, dueToday, money } = selection
  const date = (iso: string) =>
    formatShortDate(zurichDate(new Date(iso)), zurichDate(now), intlLocale)
  const time = (iso: string) =>
    dateTimeFormat(intlLocale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Zurich',
    }).format(new Date(iso))

  return (
    <>
      <DeparturePicker
        choice={picker.choice}
        config={{
          policyText: policy => t(`tourDiscovery.policyShort.${policy}`),
          policyVaries: picker.f.t('policyVaries'),
          empty: (
            <EmptyState
              action={{ label: t('tourDiscovery.browse'), to: '/tours' }}
              icon={TourIcon}
              message={t('tourDiscovery.noDates')}
            />
          ),
          soldOut: (
            <p className="text-sm text-foreground">
              {t('tourDiscovery.soldOutBody')}
            </p>
          ),
        }}
        f={picker.f}
        model={picker.model}
      />
      {selected && (
        <section className="flex flex-col gap-3 text-foreground">
          <h3 className="text-heading">{t('tourDiscovery.payment')}</h3>
          <p className="text-sm">
            {t(`tourDiscovery.policy.${selected.policy}`)}
          </p>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt>{t('tourDiscovery.total')}</dt>
              <dd className="font-semibold tabular-nums">{money(total)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>{t('tourDiscovery.dueToday')}</dt>
              <dd className="font-semibold tabular-nums">{money(dueToday)}</dd>
            </div>
            {dueToday < total && (
              <div className="flex justify-between gap-3">
                <dt className="flex flex-col gap-1">
                  {t('tourDiscovery.balance')}
                  <span className="text-xs text-muted">
                    {t('tourDiscovery.balanceDue', {
                      date: `${date(selected.balanceDueAt)} · ${time(selected.balanceDueAt)}`,
                    })}
                  </span>
                </dt>
                <dd className="font-semibold tabular-nums">
                  {money(total - dueToday)}
                </dd>
              </div>
            )}
          </dl>
          <p className="text-xs text-muted">{t('tourDiscovery.sample')}</p>
        </section>
      )}
      {/* The C03 sheet's closing note: a plain icon line. */}
      <p className="flex items-start gap-2 text-sm text-foreground">
        <InfoIcon
          aria-hidden
          className="mt-0.5 shrink-0 text-muted"
          size={16}
        />
        {t('tourDiscovery.noHold')}
      </p>
    </>
  )
}

/**
 * C10 departure and group: a bottom sheet on C09, as C03's "Your gift" sheet (2.4-r5). Its
 * address is `/tours/{slug}?book=true`, so a reload, Back from C11 and C11's Edit reopen it
 * with the draft; closing returns to C09 without leaving an entry to bounce on.
 */
export function TourSelectionSheet(props: { tour: Tour, isOpen: boolean }) {
  // The detail route stays mounted from one tour to the next: the picker starts afresh.
  return <TourSheet key={props.tour.id} {...props} />
}

function TourSheet({ tour, isOpen }: { tour: Tour, isOpen: boolean }) {
  const { t, language } = useLocale()
  const navigate = useNavigate()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  // X, a swipe, Escape and the backdrop all close: one step back per history entry.
  const closedFromRef = useRef<string>(undefined)
  const selection = useTourSelection(tour, isOpen)
  const picker = useTourPicker(tour, selection)

  const close = () => {
    const { state, href } = router.state.location
    const entry = state.__TSR_key ?? href

    if (closedFromRef.current === entry)
      return
    closedFromRef.current = entry
    if (canGoBack && state.bookOverDetail) {
      router.history.back()
    }
    else {
      void navigate({
        to: '/tours/$slug',
        params: { slug: tour.slug },
        search: {},
        replace: true,
        resetScroll: false,
      })
    }
  }

  // Closed: Forward may bring the same entry back, and its X must work again.
  useEffect(() => {
    if (!isOpen)
      closedFromRef.current = undefined
  }, [isOpen])

  return (
    <ChoiceSheet
      action={{
        label: selection.reviewLabel,
        isDisabled: !selection.valid,
        onPress: () =>
          void navigate({
            to: '/tours/$slug/book/review',
            params: { slug: tour.slug },
          }),
      }}
      closeLabel={t('tourDiscovery.close')}
      isOpen={isOpen}
      summary={<PickerSummary choice={picker.choice} f={picker.f} />}
      title={pickText(tour.name, language).text}
      onOpenChange={(open) => {
        if (!open)
          close()
      }}
    >
      <TourSelectionBody picker={picker} selection={selection} />
    </ChoiceSheet>
  )
}
