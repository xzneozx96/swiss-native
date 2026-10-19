import { createFileRoute } from '@tanstack/react-router'

import { useLocale } from '@/contexts/locale-context'
import { ServicePage } from '@/features/discovery/components/service-page'

export const Route = createFileRoute('/_guest/experiences')({
  component: ExperiencesPage,
})

function ExperiencesPage() {
  const { t } = useLocale()

  return (
    <ServicePage
      body={t('home.experience.body')}
      eyebrow={t('home.experience.eyebrow')}
      highlights={[
        t('home.experience.highlight1'),
        t('home.experience.highlight2'),
        t('home.experience.highlight3'),
      ]}
      photo="finsterwald-7"
      photoAlt={t('home.experience.photoAlt')}
      title={t('home.experience.title')}
    />
  )
}
