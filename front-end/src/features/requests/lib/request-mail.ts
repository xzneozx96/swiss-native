import type { PrivateTourRequest } from '../types'
import type { DemoState } from '@/features/demo/types'

import { shop } from '@/features/catalog/seed'
import { sendMail } from '@/features/notifications/mail'

/**
 * N17 new private-tour request: one mail to the host (Erich Haldi), in English. The guest
 * gets no mail (A2).
 */
export function mailPrivateTourRequest(
  state: DemoState,
  request: PrivateTourRequest,
): DemoState {
  return sendMail(state, {
    at: request.sentAt,
    to: 'staff',
    recipient: `${shop.ownerName} (Host)`,
    language: 'en',
    template: 'N17',
    params: {
      requestId: request.id,
      staffName: shop.ownerName,
      email: request.email,
      guestLanguage: request.language,
      sentAt: request.sentAt,
      groupSize: request.groupSize,
      dateFrom: request.dateFrom,
      dateTo: request.dateTo,
      interests: request.interests,
    },
  })
}
