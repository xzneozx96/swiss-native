import type { Language } from '@/contexts/locale-context'

/** A sent C22 request, (D8: no sign-in, group size 1–50). */
export interface PrivateTourRequest {
  id: string
  sentAt: string
  language: Language
  email: string
  groupSize: number
  /** YYYY-MM-DD. */
  dateFrom: string
  /** YYYY-MM-DD. */
  dateTo: string
  /** Optional free text (A1); empty when the guest left it out. */
  interests: string
}
