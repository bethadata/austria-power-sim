import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

/*
 * Surfaces sit *above* the page plane in both themes: cards are the lighter
 * (light mode) or lighter-than-black (dark mode) layer, which is what makes the
 * `flat border` card style read as a panel. The previous theme had it the other
 * way round in light mode -- background #ffffff with surface #f4f4f4 -- so every
 * card was a grey box on white and a border added nothing.
 *
 * Charts draw on a transparent paper (see composables/usePlotly.ts), so a Plotly
 * panel takes the card colour instead of a near-miss hardcoded hex.
 *
 * These are chrome values only. Unifying the *series* colours with
 * austria_population's hand-validated palette.ts is ../TASKS.md section 2 and is
 * deliberately not decided here.
 */
const CHROME = {
  light: { plane: '#f9f9f7', surface: '#fcfcfb' },
  dark: { plane: '#0d0d0d', surface: '#1a1a19' },
}

export default createVuetify({
  icons: { defaultSet: 'mdi' },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: CHROME.light.plane,
          surface: CHROME.light.surface,
          // The green is the app's identity, but #4caf50 clears only ~2.8:1 on a
          // near-white surface, and it is used for link text and the active nav
          // item -- not just for fills. Both modes carry the shade that reads at
          // text size on their own surface.
          primary: '#2e7d32',
          secondary: '#52514e',
          error: '#c62828',
          info: '#2a78d6',
          success: '#2e7d32',
          warning: '#b26a00',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: CHROME.dark.plane,
          surface: CHROME.dark.surface,
          primary: '#66bb6a',
          secondary: '#c3c2b7',
          error: '#ef5350',
          info: '#3987e5',
          success: '#66bb6a',
          warning: '#fab219',
        },
      },
    },
  },
})
