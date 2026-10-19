/**
 * Photo registry: every JPEG in src/assets/photos, keyed by file name without extension.
 * Sources and licences are listed in src/assets/photos/CREDITS.txt.
 */
const files = import.meta.glob<string>('/src/assets/photos/*.jpg', {
  eager: true,
  import: 'default',
})

const bySlug = new Map(
  Object.entries(files).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1, -'.jpg'.length),
    url,
  ]),
)

/** A photo uploaded in M12/M13, kept in demo data as a small JPEG, PNG or WebP data URL. */
const UPLOADED = /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/

// A data URL runs to 300K characters and is usually checked twice in a row (a story image's
// check, then its <img>), so the last one that passed skips the second scan.
let lastUploaded: string | undefined

/**
 * URL for a photo slug, or undefined when the photo is not in the repo yet. An uploaded
 * photo (a data URL) is its own URL.
 */
export function photoUrl(slug: string | undefined): string | undefined {
  if (!slug)
    return undefined
  if (slug === lastUploaded)
    return slug
  if (!UPLOADED.test(slug))
    return bySlug.get(slug)
  lastUploaded = slug

  return slug
}
