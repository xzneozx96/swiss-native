export type StaffId = 'owner'

export type PaymentMethod = 'online' | 'cash' | 'bank-transfer' | 'other'

export interface Payment {
  id: string
  /** Rappen. */
  amount: number
  method: PaymentMethod
  /** Online payments count only when the provider confirms them (spec §2.3). */
  status: 'processing' | 'succeeded' | 'failed'
  at: string
  recordedBy?: StaffId
  note?: string
}

export type Outcome = 'succeeded' | 'failed' | 'processing'

/**
 * What the simulated provider shows: `choose` (the three outcomes), `failed` (after Fail, with
 * retry), `processing` (a payment is already open, so no second Pay) or `blocked` (nothing to pay).
 */
export type PaymentStep
  = | { kind: 'choose' }
    | { kind: 'failed' }
    | { kind: 'processing' }
    | { kind: 'blocked', reason: string }

export interface PaymentView {
  seller: string
  amount: string
  ref: string
  step: PaymentStep
  /** True from the first press until the screen changes, so a double tap never pays twice. */
  isPending: boolean
  choose: (outcome: Outcome) => void
  retry: () => void
  back: () => void
}
