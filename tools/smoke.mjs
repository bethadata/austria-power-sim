/**
 * Headless smoke test against the built site.
 *
 *   npm run build
 *   npm run preview &        # :4176
 *   npm run test:smoke
 *
 * Assertions, not screenshots. Everything here is a failure mode that renders as
 * a page which merely looks a bit wrong, with nothing in the console — which is
 * the whole class this app is exposed to, since a simulator whose chart comes
 * out blank looks exactly like a simulator whose parameters produced nothing.
 *
 * Four of the checks below were written from bugs this file found on the day it
 * was added (2026-08-30), and are the reason it exists rather than a typecheck:
 *
 *  - a flex column with a max-height *shrinks* its cards instead of scrolling,
 *    and a v-card clips its own content, so the control rail silently dropped a
 *    panel header and its last field at 1366x768 and not at 1600x1000;
 *  - `theme.current.value.colors['on-surface']` is undefined in Vuetify 4, so
 *    Plotly fell back to its own default colours and the dark theme drew
 *    near-white gridlines over the series;
 *  - Plotly sizes a chart once, from offsetWidth, and `responsive: true` listens
 *    to *window* resizes only, so toggling the navigation drawer left every
 *    chart at its old width;
 *  - a locale key present in one language and not the other renders as the raw
 *    key, which no typecheck sees.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const BASE = process.env.SMOKE_BASE ?? 'http://localhost:4176/austria-power-sim/'

const LOCALES = ['de', 'en']
const ROUTES = [
  { hash: '#/', name: 'home', plots: 4 },
  { hash: '#/model', name: 'model', plots: 0 },
  { hash: '#/about', name: 'about', plots: 0 },
]

const localeFile = (loc) =>
  JSON.parse(
    readFileSync(
      fileURLToPath(new URL(`../src/locales/${loc}/home_${loc}.json`, import.meta.url)),
      'utf-8',
    ),
  )

/** Every leaf key path in a messages object. */
function flatKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object'
      ? flatKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

/*
 * The untranslated-key pattern is derived from the locale file rather than
 * hardcoded, so a new namespace is covered the day it is added. Messages are
 * spread-merged flat in i18n.ts (see ../TASKS.md section 2), which is exactly
 * why a missed key surfaces as the bare `namespace.key` text.
 */
const NAMESPACES = [...new Set(flatKeys(localeFile('en')).map((k) => k.split('.')[0]))]
const UNTRANSLATED = new RegExp(`(^|\\s)(${NAMESPACES.join('|')})\\.[a-z0-9_.]+`, 'i')
/** A {name} the message asked for and nothing supplied. */
const UNFILLED = /\{[a-z_]+\}/i

const failures = []
const problems = []

function check(ok, label, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok || !detail ? '' : '  — ' + detail}`)
  if (!ok) failures.push(label)
}

/** Wait until the simulation has produced numbers, not just until the DOM exists. */
async function waitForModel(page) {
  await page.waitForFunction(
    () => document.querySelectorAll('.js-plotly-plot').length >= 4,
    null,
    { timeout: 30000 },
  )
  await page.waitForTimeout(1200)
}

const kpiValues = (page) =>
  page.$$eval('.text-headline-small', (els) => els.map((e) => e.textContent.trim()))

const browser = await chromium.launch()

// ---------------------------------------------------------------------------
// 1 · Locale key sets must match exactly.
// ---------------------------------------------------------------------------
{
  const de = new Set(flatKeys(localeFile('de')))
  const en = new Set(flatKeys(localeFile('en')))
  const onlyDe = [...de].filter((k) => !en.has(k))
  const onlyEn = [...en].filter((k) => !de.has(k))
  check(
    onlyDe.length === 0 && onlyEn.length === 0,
    'de and en carry the same key set',
    `only de: ${onlyDe.join(',') || '-'} | only en: ${onlyEn.join(',') || '-'}`,
  )
}

// ---------------------------------------------------------------------------
// 2 · Every route, in both locales: renders, translated, charts have traces.
// ---------------------------------------------------------------------------
const consoleErrors = []

for (const locale of LOCALES) {
  /*
   * A fresh context per locale with the preference planted before any page
   * script runs. Setting localStorage after navigating does not work: a goto()
   * that differs only in its hash is a same-document navigation, so the app
   * keeps the instance it already booted and the second locale is never
   * exercised.
   */
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
  await context.addInitScript((l) => localStorage.setItem('lang', l), locale)
  const page = await context.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160))
  })
  page.on('pageerror', (e) => consoleErrors.push('UNCAUGHT: ' + e.message.slice(0, 160)))
  page.on('response', (r) => {
    if (r.status() >= 400) consoleErrors.push(`HTTP ${r.status()} ${r.url().slice(0, 100)}`)
  })

  for (const route of ROUTES) {
    await page.goto(BASE + route.hash, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('h1', { timeout: 15000 })
    if (route.plots > 0) await waitForModel(page)
    else await page.waitForTimeout(600)

    const label = `${locale} ${route.name}`
    const heading = (await page.locator('h1').first().innerText()).trim()
    check(heading.length > 0, `${label}: page has a non-empty h1`)

    const bodyText = await page.locator('body').innerText()
    /*
     * Series and axis labels live in Plotly's SVG, which innerText does not
     * reach — collected separately, or a legend of raw keys would pass.
     */
    const svgText = await page.evaluate(() =>
      [...document.querySelectorAll('.js-plotly-plot text')]
        .map((el) => el.textContent ?? '')
        .join(' | '),
    )
    const key = bodyText.match(UNTRANSLATED) ?? svgText.match(UNTRANSLATED)
    check(!key, `${label}: no untranslated key on the page`, key?.[0]?.trim())
    const unfilled = `${bodyText} | ${svgText}`.match(UNFILLED)
    check(!unfilled, `${label}: no unfilled placeholder`, unfilled?.[0])

    if (route.plots > 0) {
      const plots = await page.locator('.js-plotly-plot').count()
      check(plots === route.plots, `${label}: ${route.plots} charts rendered`, `got ${plots}`)

      // A drawn chart that holds no traces is the silent blank-chart failure.
      const traceless = await page.evaluate(
        () =>
          [...document.querySelectorAll('.js-plotly-plot')].filter(
            (el) => el.querySelectorAll('.trace, .point, .bars, g.scatterlayer > g').length === 0,
          ).length,
      )
      check(traceless === 0, `${label}: every chart drew traces`, `${traceless} empty`)

      const kpis = await kpiValues(page)
      check(
        kpis.length === 3 && kpis.every((v) => /\d/.test(v)),
        `${label}: three KPI tiles carry numbers`,
        kpis.join(' | '),
      )
    }
  }

  // Prove the locale actually applied rather than silently testing the default
  // twice: <html lang> is set from it on mount.
  const lang = await page.getAttribute('html', 'lang')
  check(lang === locale, `${locale}: html lang applied`, `got ${lang}`)

  await context.close()
}

// ---------------------------------------------------------------------------
// 3 · The control rail: cards must scroll, never be squashed and clipped.
// ---------------------------------------------------------------------------
{
  // 1366x768 on purpose. The rail fits at 1600x1000 with both storages on, so a
  // desktop-only run reads as green while a laptop loses a field.
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await waitForModel(page)

  // Both storages open is the tallest the rail gets.
  await page.getByLabel(/Enable batteries|Batterien aktivieren/).click()
  await page.getByLabel(/Enable hydrogen|Wasserstoff aktivieren/).click()
  await page.waitForTimeout(900)

  const rail = await page.evaluate(() => {
    const el = document.querySelector('.control-rail')
    const cards = [...el.querySelectorAll(':scope > .v-card')].map((c) => ({
      clipped: c.scrollHeight - c.clientHeight,
      fields: c.querySelectorAll('.v-field').length,
      heading: c.querySelector('h3')?.textContent?.trim() ?? '',
    }))
    return {
      scrolls: el.scrollHeight > el.clientHeight,
      sticky: getComputedStyle(el).position === 'sticky',
      cards,
    }
  })

  check(rail.sticky, 'control rail is sticky on a laptop viewport')
  check(rail.cards.length === 2, 'control rail holds both panels', `${rail.cards.length}`)
  check(
    rail.cards.every((c) => c.clipped <= 1),
    'no rail card clips its own content',
    rail.cards.map((c) => `${c.heading || '(no heading)'}: ${c.clipped}px over`).join(' | '),
  )
  check(
    rail.cards.every((c) => c.heading.length > 0),
    'every rail card renders its heading',
    JSON.stringify(rail.cards.map((c) => c.heading)),
  )
  // 3 scenario fields + 5 capacities + 2 battery + 3 hydrogen.
  const fields = rail.cards.reduce((sum, c) => sum + c.fields, 0)
  check(fields === 13, 'all 13 inputs are present with both storages on', `${fields}`)
  check(rail.scrolls, 'the rail scrolls rather than compressing', 'content fits — check again if the form grows')

  // The simulation must actually respond to the storages.
  const before = await kpiValues(page)
  const setField = async (label, value) => {
    const input = page.locator(`.v-text-field:has(label:text-is("${label}")) input`)
    await input.fill(String(value))
    await input.dispatchEvent('input')
  }
  await setField('Battery capacity', 20)
  await setField('Battery power', 5)
  await setField('Hydrogen storage', 3)
  await setField('Electrolyser power', 4)
  await setField('Gas power', 4)
  await page.waitForTimeout(2000)
  const after = await kpiValues(page)
  check(
    before.join() !== after.join(),
    'storage parameters move the KPIs',
    `${before.join('|')} -> ${after.join('|')}`,
  )

  // No select may truncate its own value.
  const truncated = await page.evaluate(() =>
    [...document.querySelectorAll('.v-select__selection-text')]
      .filter((e) => e.scrollWidth > e.clientWidth + 1)
      .map((e) => e.textContent.trim()),
  )
  check(truncated.length === 0, 'no select label is truncated', truncated.join(' | '))

  await context.close()
}

// ---------------------------------------------------------------------------
// 4 · Charts follow the theme, and follow their container.
// ---------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await waitForModel(page)

  /**
   * Read a chart's ink against the card behind it.
   *
   * `PLOTLY_DEFAULT` is the giveaway: when the layout hands Plotly a colour it
   * cannot parse, it silently substitutes its own #444 text and near-white
   * grid, which is legible in light mode and unreadable in dark — so contrast
   * alone would not catch it in light mode. Both are asserted.
   */
  const inkReport = () =>
    page.evaluate(() => {
      const parse = (c) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
      const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b
      const gd = document.querySelector('.js-plotly-plot')
      const tick = gd.querySelector('.xtick text')
      const grid = gd.querySelector('.xgrid, .ygrid')
      const surface = getComputedStyle(gd.closest('.v-card')).backgroundColor
      const paper = gd.querySelector('.bg')
      return {
        tick: getComputedStyle(tick).fill,
        grid: grid?.getAttribute('style') ?? '',
        contrast: Math.abs(lum(parse(getComputedStyle(tick).fill)) - lum(parse(surface))),
        /*
         * Plotly always emits the background rects; what matters is whether they
         * are painted. An `rgba(0,0,0,0)` layout colour lands as
         * `fill: rgb(0, 0, 0)` plus `fill-opacity: 0`, so reading `fill` alone
         * reports an opaque black paper on a chart that is in fact transparent —
         * which is how this check first read, and it failed a correct build.
         */
        paperPainted: [...gd.querySelectorAll('.bg')].some((rect) => {
          const cs = getComputedStyle(rect)
          return cs.fill !== 'none' && Number(cs.fillOpacity) > 0
        }),
        paperFill: paper
          ? `${getComputedStyle(paper).fill} @ ${getComputedStyle(paper).fillOpacity}`
          : 'none',
      }
    })

  const PLOTLY_DEFAULT_INK = 'rgb(68, 68, 68)'

  const light = await inkReport()
  check(light.contrast > 90, 'light theme: axis text readable on the card', `Δlum ${Math.round(light.contrast)}`)
  check(light.tick !== PLOTLY_DEFAULT_INK, 'light theme: chart ink comes from the theme, not Plotly defaults', light.tick)
  check(!light.paperPainted, 'light theme: chart paper is transparent', light.paperFill)

  await page.locator('button[aria-label="Toggle dark mode"], button[aria-label="Dark Mode umschalten"]').click()
  await page.waitForTimeout(1600)
  const dark = await inkReport()
  check(dark.contrast > 90, 'dark theme: axis text readable on the card', `Δlum ${Math.round(dark.contrast)}`)
  check(dark.tick !== PLOTLY_DEFAULT_INK, 'dark theme: chart ink comes from the theme, not Plotly defaults', dark.tick)
  check(dark.tick !== light.tick, 'chart ink actually changes with the theme', `${light.tick} -> ${dark.tick}`)
  check(!dark.paperPainted, 'dark theme: chart paper is transparent', dark.paperFill)
  await page.locator('button[aria-label="Toggle dark mode"], button[aria-label="Dark Mode umschalten"]').click()
  await page.waitForTimeout(1400)

  // Collapsing the navigation drawer changes the card width but not the
  // window's, which is the resize Plotly does not notice on its own.
  const plotWidth = () =>
    page.evaluate(() => ({
      card: Math.round(document.querySelector('.js-plotly-plot').getBoundingClientRect().width),
      svg: Math.round(document.querySelector('.js-plotly-plot .main-svg').getBoundingClientRect().width),
    }))

  const openWidth = await plotWidth()
  await page.click('.v-app-bar-nav-icon')
  await page.waitForTimeout(1500)
  const closedWidth = await plotWidth()
  check(closedWidth.card > openWidth.card + 100, 'collapsing the drawer widens the chart card',
    `${openWidth.card} -> ${closedWidth.card}`)
  check(Math.abs(closedWidth.svg - closedWidth.card) < 4, 'the plot follows its card on resize',
    `card ${closedWidth.card}, svg ${closedWidth.svg}`)
  await page.click('.v-app-bar-nav-icon')
  await page.waitForTimeout(1200)

  // Fullscreen has to draw into the dialog's own graph div; Plotly cannot move
  // a rendered plot between two elements.
  await page.locator('button[aria-label*="fullscreen"]').first().click()
  await page.waitForTimeout(2000)
  const dialog = await page.evaluate(() => {
    const gd = document.querySelector('.v-dialog .js-plotly-plot')
    return gd
      ? {
          width: Math.round(gd.getBoundingClientRect().width),
          traces: gd.querySelectorAll('.trace, g.scatterlayer > g').length,
        }
      : null
  })
  check(dialog !== null && dialog.width > 1400 && dialog.traces > 0,
    'fullscreen dialog draws the chart at viewport width', JSON.stringify(dialog))
  await page.keyboard.press('Escape')

  await context.close()
}

// ---------------------------------------------------------------------------
// 5 · Phone width: single column, no horizontal scroll.
// ---------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await waitForModel(page)

  const mobile = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    railStatic: getComputedStyle(document.querySelector('.control-rail')).position === 'static',
    plotOver: Math.max(
      ...[...document.querySelectorAll('.js-plotly-plot')].map((gd) =>
        Math.round(gd.getBoundingClientRect().right - gd.closest('.v-card').getBoundingClientRect().right),
      ),
    ),
  }))
  check(mobile.overflow <= 2, 'no horizontal scroll at phone width', `${mobile.overflow}px`)
  check(mobile.railStatic, 'control rail is not sticky on a phone')
  check(mobile.plotOver <= 1, 'no chart overflows its card', `${mobile.plotOver}px over`)

  await context.close()
}

// ---------------------------------------------------------------------------
await browser.close()

for (const err of [...new Set(consoleErrors)].slice(0, 8)) {
  problems.push(`console/network: ${err}`)
}
check(problems.length === 0, 'no console errors or failed requests', problems.join(' | '))

console.log(
  failures.length
    ? `\nFAIL (${failures.length}):\n  - ${failures.join('\n  - ')}`
    : '\nAll smoke checks passed',
)
process.exit(failures.length ? 1 : 0)
