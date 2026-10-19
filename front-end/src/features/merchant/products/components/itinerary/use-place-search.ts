import { useEffect, useState } from 'react'

const BOLD_TAG = /<b>[\s\S]*?<\/b>/
const BOLD_TAG_CAPTURE = /<b>([\s\S]*?)<\/b>/
const WHITESPACE_RUNS = /\s+/g

export interface Place {
  /** Stable key: the search server's id plus origin. */
  key: string
  name: string
  /** Kind and area, e.g. "Historisches Areal · (LU) - Luzern". */
  detail: string
  /** [lng, lat], as a stop stores it. */
  coordinates: [number, number]
}

export type SearchState
  = | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'done', places: Place[] }

export const PLACE_SEARCH_ORIGIN = 'https://api3.geo.admin.ch'
/** swisstopo's SearchServer: free, no key, CORS open. Streets and addresses in Switzerland. */
const ENDPOINT = `${PLACE_SEARCH_ORIGIN}/rest/services/api/SearchServer`
const ORIGINS = 'gazetteer,address,zipcode'
const MIN_LENGTH = 2
const DEBOUNCE_MS = 300

interface Hit {
  id: number
  attrs: { label: string, lat: number, lon: number, origin: string }
}

const TAG = /<[^>]*>/g
function clean(html: string) {
  return html.replace(TAG, '').replace(WHITESPACE_RUNS, ' ').trim()
}

/**
 * Labels arrive as HTML (`<i>Kind</i> <b>Name</b> (LU) - Town`). The bold text is the name;
 * what is left is the detail. Text is taken apart with a pattern, never rendered as HTML.
 */
function toPlace(hit: Hit): Place {
  const bold = BOLD_TAG_CAPTURE.exec(hit.attrs.label)
  const full = clean(hit.attrs.label)
  // An address reads "Kapellbrücke 1, 6004 Luzern": the bold part alone is only the town.
  const name = bold && hit.attrs.origin === 'gazetteer' ? clean(bold[1]) : full
  const detail
    = name === full
      ? ''
      : clean(hit.attrs.label.replace(BOLD_TAG, ' '))

  return {
    key: `${hit.attrs.origin}-${hit.id}`,
    name: name || full,
    detail,
    coordinates: [hit.attrs.lon, hit.attrs.lat],
  }
}

/** The same name, detail and spot (to ~1 m) is one result. */
function unique(places: Place[]) {
  const seen = new Set<string>()

  return places.filter((place) => {
    const id = `${place.name}|${place.detail}|${place.coordinates[0].toFixed(5)}|${place.coordinates[1].toFixed(5)}`

    if (seen.has(id))
      return false
    seen.add(id)

    return true
  })
}

async function searchPlaces(text: string, signal: AbortSignal) {
  const url = new URL(ENDPOINT)

  url.search = new URLSearchParams({
    searchText: text,
    type: 'locations',
    limit: '8',
    sr: '4326',
    origins: ORIGINS,
  }).toString()
  const response = await fetch(url, { signal })

  if (!response.ok)
    throw new Error(String(response.status))
  const body = (await response.json()) as { results?: Hit[] }

  return unique((body.results ?? []).map(toPlace)).slice(0, 6)
}

/** Debounced place search; a newer query (or unmount) aborts the one in flight. */
export function usePlaceSearch(query: string, attempt = 0): SearchState {
  const text = query.trim()
  const [state, setState] = useState<SearchState>({ status: 'idle' })
  const tooShort = text.length < MIN_LENGTH
  const [wasTooShort, setWasTooShort] = useState(tooShort)

  // Clearing the field (or typing less than the minimum) drops the results at once.
  if (tooShort !== wasTooShort) {
    setWasTooShort(tooShort)
    if (tooShort)
      setState({ status: 'idle' })
  }

  useEffect(() => {
    if (tooShort)
      return
    const controller = new AbortController()
    const timer = setTimeout(() => {
      setState({ status: 'loading' })
      searchPlaces(text, controller.signal).then(
        places => setState({ status: 'done', places }),
        (error: Error) => {
          if (error.name !== 'AbortError')
            setState({ status: 'error' })
        },
      )
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [text, tooShort, attempt])

  return state
}
