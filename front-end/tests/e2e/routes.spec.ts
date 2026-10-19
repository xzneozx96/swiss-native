import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/tours',
  '/passes',
  '/plan',
  '/search',
  '/account',
  '/bookings',
  '/sign-in',
  '/credits',
  '/store',
  '/store/bookings',
  '/store/calendar',
  '/store/sales',
  '/store/products/tours',
  '/store/products/stays',
  '/store/products/experiences',
]

for (const language of ['en', 'de'] as const) {
  for (const route of routes) {
    test(`${route} renders in ${language} without errors @smoke`, async ({ page }) => {
      const errors: string[] = []

      page.on('pageerror', error => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error' && !message.text().includes('Failed to load resource'))
          errors.push(message.text())
      })
      await page.addInitScript((value) => {
        localStorage.setItem('sk.language', JSON.stringify(value))
      }, language)
      await page.goto(`/#${route}`)

      await expect(page.locator('#root > *').first()).toBeVisible()
      await page.waitForTimeout(500)
      expect(errors).toEqual([])
    })
  }
}

test('English never downloads the German dictionary @smoke', async ({ page }) => {
  const scripts: string[] = []

  page.on('request', (request) => {
    if (request.resourceType() === 'script')
      scripts.push(request.url())
  })
  await page.goto('/#/')
  await expect(page.locator('#root > *').first()).toBeVisible()
  await page.waitForTimeout(1000)

  expect(scripts.filter(url => /\/i18n\/de\.ts|\/de-[\w-]+\.js/.test(url))).toEqual([])
})

for (const [language, shown, hidden] of [['en', 'Explore', 'Entdecken'], ['de', 'Entdecken', 'Explore']] as const) {
  test(`the tab bar is in ${language} from the first paint @smoke`, async ({ page }) => {
    await page.addInitScript((value) => {
      localStorage.setItem('sk.language', JSON.stringify(value))
    }, language)
    await page.goto('/#/')

    await expect(page.getByRole('navigation').getByText(shown, { exact: true }).first()).toBeVisible()
    await expect(page.getByText(hidden, { exact: true })).toHaveCount(0)
  })
}
