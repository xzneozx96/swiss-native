import type { Language } from '@/contexts/locale-context'
import type { LocalizedRich } from '@/lib/rich-text'

/** Text written by the merchant. A language may be missing (R02: publish in one language). */
export type LocalizedText = Partial<Record<Language, string>>

/** Money in Rappen (1 CHF = 100) so sums never drift. */
export type Rappen = number

/**
 * The story behind a tour. Optional.
 * The body is rich text per language (Tiptap JSON), edited in M13 since 15.10.2026;
 * stored stories in the older chapter shape are converted on load (demo/upgrade.ts).
 */
export interface ProductStory {
  title: LocalizedText
  body: LocalizedRich
}

export interface Review {
  id: string
  productId: string
  guestName: string
  rating: 1 | 2 | 3 | 4 | 5
  text: LocalizedText
  createdAt: string
  /** When the reviewer's booking was completed. */
  purchasedAt: string
  /** Photos the guest added (slugs in src/assets/photos; sample shots in the prototype). */
  photos?: string[]
  /** The shop's public answer (spec §4.11, M23), in the language it was written in. */
  reply?: { text: string, language: Language, by: string, at: string }
}

export interface Shop {
  /** Guest-facing seller name on receipts (PRD §9.2). The brand name is still open (O01). */
  name: string
  ownerName: string
  email: string
  /** Shop phone for guests (C03 seller card); sample number in the prototype. */
  phone: string
  /** Where guests find the shop (the seller sheet's Directions). */
  address: string
  openingHours: LocalizedText
}
