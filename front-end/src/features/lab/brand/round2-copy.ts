/**
 * Lab-only strings added in round 2 (postcard and road-line variations). The photo
 * caption names the Entlebuch because finsterwald-1 is a photo of the UNESCO Biosphere
 * Entlebuch; nothing here describes the host beyond what the app already says.
 */
import type { LabLanguage } from './copy'

export const round2Copy = {
  en: {
    greetings: 'Greetings from the Entlebuch',
    turn: 'Turn the postcard over',
    turnHint: 'Tap the card to turn it over',
    turnBack: 'Tap again for the photo',
    postcardHeader: 'Postkarte · Carte postale · Cartolina',
    airmail: 'Par avion',
    passNames: 'Furka · Grimsel · Susten · Gotthard · Nufenen',
  },
  de: {
    greetings: 'Grüsse aus dem Entlebuch',
    turn: 'Postkarte umdrehen',
    turnHint: 'Tippe auf die Karte, um sie umzudrehen',
    turnBack: 'Nochmals tippen für das Foto',
    postcardHeader: 'Postkarte · Carte postale · Cartolina',
    airmail: 'Par avion',
    passNames: 'Furka · Grimsel · Susten · Gotthard · Nufenen',
  },
} as const satisfies Record<LabLanguage, Record<string, string>>

export type Round2Copy = (typeof round2Copy)[LabLanguage]
