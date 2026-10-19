import { Link } from '@tanstack/react-router'

import { BackIcon } from '@/components/icons'
import { Media } from '@/components/media'
import { useLocale } from '@/contexts/locale-context'
import { shop } from '@/features/catalog/seed'

interface ServicePageProps {
  photo: string
  photoAlt: string
  eyebrow: string
  title: string
  body: string
  highlights: string[]
}

/** One service of the host (stay or experience): photo, description, facts and who to ask. */
export function ServicePage({
  photo,
  photoAlt,
  eyebrow,
  title,
  body,
  highlights,
}: ServicePageProps) {
  const { t } = useLocale()

  return (
    <article className="flex flex-col gap-5 pb-4">
      <div className="relative">
        <Media alt={photoAlt} className="aspect-[4/3]" photo={photo} />
        <Link
          aria-label={t('placeholder.backHome')}
          className="absolute start-4 top-[calc(env(safe-area-inset-top,0px)+12px)] flex size-11 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-surface outline-none backdrop-blur focus-visible:focus-ring active:scale-95"
          to="/"
        >
          <BackIcon size={22} />
        </Link>
      </div>
      <div className="flex flex-col gap-5 px-4">
        <div className="flex flex-col gap-1">
          <p className="text-label text-muted">{eyebrow}</p>
          <h1 className="font-serif text-[26px] leading-8 text-balance">
            {title}
          </h1>
        </div>
        <p className="text-body text-muted">{body}</p>
        <ul className="flex flex-wrap gap-2">
          {highlights.map(item => (
            <li
              key={item}
              className="rounded-full bg-default px-3 py-1 text-xs font-medium"
            >
              {item}
            </li>
          ))}
        </ul>
        <section className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
          <p className="text-label text-muted">
            {t('service.hostedBy', { name: shop.ownerName })}
          </p>
          <a
            className="flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground outline-none select-none focus-visible:focus-ring active:opacity-80"
            href={`mailto:${shop.email}?subject=${encodeURIComponent(title)}`}
          >
            {t('service.contact', { name: shop.ownerName })}
          </a>
        </section>
      </div>
    </article>
  )
}
