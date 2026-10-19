import type { DiscoveryHomeView } from '../components/discovery-home'

import { useLocale } from '@/contexts/locale-context'
import { useDemoSelector } from '@/features/demo'
import { isTour } from '@/features/tours/lib/selectors'

/** Builds the discovery home from the tour data and the language. */
export function useDiscoveryView(): DiscoveryHomeView {
  const { t } = useLocale()
  const demoTours = useDemoSelector(s => s.data.tours)

  const tours = (demoTours?.tours ?? []).filter(
    tour => isTour(tour) && tour.published,
  )

  return {
    hero: {
      appName: t('app.name'),
      hello: t('home.hello'),
      title: t('home.heroTitle'),
      photoAlt: t('home.photoAlt'),
      searchLabel: t('search.open'),
      searchPrompt: t('home.searchPrompt'),
    },
    tours: {
      title: t('home.tours.title'),
      subtitle: t('home.tours.subtitle'),
      seeAll: t('home.seeAll'),
      items: tours,
    },
  }
}
