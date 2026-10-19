import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
// Renders the same routes from two static vite builds with a frozen clock and diffs the visible text.
// usage: node compare-builds.mjs <baseDir> <newDir> <outDir>
// Renders the same routes from two static builds with a frozen clock and diffs the visible text.
// usage: node scripts/verify/compare-builds.mjs <baseDir> <newDir> <outDir>
import process from 'node:process'
import { launchBrowser, serve } from './browser.mjs'

const [baseDir, newDir, outDir] = process.argv.slice(2)

const FROZEN = new Date('2026-10-14T09:30:00+02:00')

const SETS = [
  {
    name: 'guest',
    role: 'guest',
    routes: ['/', '/tours', '/tours/:slug', '/passes', '/experiences', '/search', '/plan', '/credits', '/bookings', '/account', '/account/bookings/:booking', '/account/bookings/:booking/pay'],
  },
  {
    name: 'owner',
    role: 'owner',
    routes: ['/store', '/store/bookings', '/store/bookings/:booking', '/store/bookings/departures/:departure', '/store/calendar', '/store/sales', '/store/products', '/store/products/tours', '/store/products/stays', '/store/products/experiences', '/store/products/tours/:tour', '/store/products/tours/:tour?step=departures', '/store/products/tours/:tour?step=bogus', '/store/products?tab=tours', '/store/products?tab=nope'],
  },
]

async function capture(label, dir) {
  const { server, port } = await serve(dir)
  const browser = await launchBrowser()
  const result = {}
  const errors = {}

  for (const lang of ['en', 'de']) {
    for (const set of SETS) {
      const context = await browser.newContext({ viewport: { width: 430, height: 932 } })

      await context.clock.setFixedTime(FROZEN)
      const page = await context.newPage()
      const base = `http://localhost:${port}/index.html`

      await page.goto(`${base}#/`)
      await page.waitForTimeout(1200)
      const ids = await page.evaluate(
        ({ role, lang }) => {
          const state = JSON.parse(localStorage.getItem('sk.demo'))
          const d = state.data
          const booking = d.tours.bookings.find(b => d.guests.some(g => g.id === b.guestId)) ?? d.tours.bookings[0]

          state.role = role
          d.signedInGuestId = booking.guestId
          localStorage.setItem('sk.demo', JSON.stringify(state))
          localStorage.setItem('sk.language', JSON.stringify(lang))

          return {
            booking: booking.id,
            departure: d.tours.departures[0].id,
            tour: d.tours.tours[0].id,
            slug: d.tours.tours.find(t => t.kind === 'tour')?.slug ?? d.tours.tours[0].id,
          }
        },
        { role: set.role, lang },
      )

      await page.reload()
      await page.waitForTimeout(1200)

      for (const route of set.routes) {
        const path = route.replace(':booking', ids.booking).replace(':departure', ids.departure).replace(':tour', ids.tour).replace(':slug', ids.slug)
        const key = `${lang}${set.name}${route.replaceAll('/', '_')}`
        const messages = []
        const onError = e => messages.push(String(e.message).slice(0, 160))

        page.on('pageerror', onError)
        await page.evaluate((p) => { location.hash = p }, path)
        await page.waitForTimeout(900)
        // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- innerText is the text a visitor can see; textContent would include hidden nodes
        result[key] = await page.evaluate(() => document.body.innerText)
        errors[key] = messages
        page.off('pageerror', onError)
      }
      await context.close()
    }
  }
  await browser.close()
  server.close()
  mkdirSync(join(outDir, label), { recursive: true })
  writeFileSync(join(outDir, label, 'text.json'), JSON.stringify(result, null, 1))
  writeFileSync(join(outDir, label, 'errors.json'), JSON.stringify(errors, null, 1))

  return { result, errors }
}

mkdirSync(outDir, { recursive: true })
const a = await capture('base', baseDir)
const b = await capture('new', newDir)
let same = 0
const diffs = []

for (const key of Object.keys(a.result)) {
  if (a.result[key] === b.result[key])
    same++
  else diffs.push(key)
}
const errA = Object.values(a.errors).flat().length
const errB = Object.values(b.errors).flat().length

console.log(`routes compared: ${Object.keys(a.result).length}, identical text: ${same}, different: ${diffs.length}`)
console.log(`page errors base: ${errA}, new: ${errB}`)
for (const key of diffs) {
  const x = a.result[key].split('\n')
  const y = b.result[key].split('\n')
  const changed = []

  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if (x[i] !== y[i])
      changed.push(`  - ${x[i] ?? ''}\n  + ${y[i] ?? ''}`)
  }
  console.log(`DIFF ${key} (${changed.length} lines)\n${changed.slice(0, 6).join('\n')}`)
}
