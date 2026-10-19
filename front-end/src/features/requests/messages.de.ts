import type { requestsEn } from './messages'

export const requestsDe: Record<keyof typeof requestsEn, string> = {
  'advice.optional': 'Freiwillig',
  'advice.email.label': 'Ihre E-Mail-Adresse',
  'advice.email.help':
    'Wir verwenden sie nur, um auf diese Anfrage zu antworten.',
  'advice.email.placeholder': 'name@beispiel.ch',
  'advice.email.error':
    'Geben Sie Ihre E-Mail-Adresse ein, damit unser Team antworten kann.',
  'advice.email.invalid': 'Prüfen Sie die E-Mail-Adresse.',
  'privateTour.entry.title': 'Mit einer Gruppe unterwegs?',
  'privateTour.entry.body':
    'Nennen Sie uns Gruppe und Daten, und unser Team plant eine private Tour für Sie.',
  'privateTour.entry.action': 'Private Tour anfragen',
  'privateTour.title': 'Private Tour',
  'privateTour.back': 'Zurück zu den Touren',
  'privateTour.intro':
    'Unser Team plant die Tour für Ihre Gruppe und antwortet per E-Mail mit einem Preis. Jetzt wird nichts gebucht oder bezahlt.',
  'privateTour.group.title': 'Ihre Gruppe',
  'privateTour.size.label': 'Personen',
  'privateTour.size.hint': '1 bis 50 Personen',
  'privateTour.dates.question': 'Welche Tage passen Ihnen?',
  'privateTour.dates.from': 'Von',
  'privateTour.dates.to': 'Bis',
  'privateTour.dates.fromTitle': 'Erster passender Tag',
  'privateTour.dates.toTitle': 'Letzter passender Tag',
  'privateTour.dates.add': 'Datum wählen',
  'privateTour.dates.hint': 'Lassen Sie «Bis» leer für einen einzelnen Tag.',
  'privateTour.dates.error': 'Wählen Sie den ersten passenden Tag.',
  'privateTour.interests.title': 'Was interessiert Sie?',
  'privateTour.interests.placeholder':
    'Geschichte, Kulinarik, ein gemütlicher Spaziergang, ein Geburtstag…',
  'privateTour.contact.title': 'Kontakt',
  'privateTour.send': 'Anfrage senden',
  'privateTour.sent.title': 'Anfrage gesendet',
  'privateTour.sent.body':
    'Vielen Dank. Unser Team hat Ihre Anfrage erhalten und antwortet an {email} mit einem Tourvorschlag und dem Preis.',
  'privateTour.sent.summary': 'Was Sie gesendet haben',
  'privateTour.sent.group': 'Gruppe',
  'privateTour.sent.people.one': '1 Person',
  'privateTour.sent.people.other': '{count} Personen',
  'privateTour.sent.dates': 'Daten',
  'privateTour.sent.interests': 'Interessen',
  'privateTour.sent.email': 'Antwort an',
  'privateTour.sent.missing':
    'Diese Anfrage ist auf diesem Gerät nicht mehr vorhanden.',

  'merchantRequests.language.en': 'Englisch',
  'merchantRequests.language.de': 'Deutsch',
  'merchantRequests.private.people.one': '1 Person',
  'merchantRequests.private.people.other': '{count} Personen',
  'requestMail.guestEmail': 'E-Mail des Gastes: {email}',
  'requestMail.guestLanguage': 'Sprache des Gastes: {language}',
  'requestMail.N17.subject':
    'Neue Anfrage für eine private Tour: {group}, {dates}',
  'requestMail.N17.greeting': 'Grüezi {name}',
  'requestMail.N17.intro': 'Ein Gast hat am {at} eine private Tour angefragt.',
  'requestMail.N17.group': 'Gruppe: {group}',
  'requestMail.N17.dates': 'Gewünschte Daten: {dates}',
  'requestMail.N17.interests': 'Interessen: {interests}',
  'requestMail.N17.reply':
    'Antworten Sie per E-Mail mit einem Tourvorschlag und dem Preis und markieren Sie die Anfrage dann als beantwortet.',
  'privateTour.entry.captionDates': 'Ihre Daten',
  'privateTour.entry.captionGroup': 'Ihre Gruppe',
  'privateTour.entry.size': 'Bis zu 50 Gäste',
  'privateTour.entry.dates': 'An Ihren Daten',
  'privateTour.entry.planned': 'Von unserem Team geplant',
}
