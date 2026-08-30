import { computed } from 'vue'
import { useTheme as useVuetifyTheme } from 'vuetify'

export type Mode = 'light' | 'dark'

const STORAGE_KEY = 'aps-theme'

/** The key the theme toggle wrote before 2026-08-29. Read once so an existing
 *  visitor keeps the mode they chose instead of being reset to light. */
const LEGACY_KEY = 'darkMode'

/** Wraps Vuetify's theme so the chart layout can read the current mode. */
export function useAppTheme() {
  const theme = useVuetifyTheme()

  function apply(mode: Mode) {
    theme.change(mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }

  function restore() {
    const stored = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY)
    if (stored === 'light' || stored === 'dark') {
      theme.change(stored)
      return
    }
    theme.change(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }

  const mode = computed<Mode>(() => (theme.current.value.dark ? 'dark' : 'light'))

  function toggle() {
    apply(mode.value === 'dark' ? 'light' : 'dark')
  }

  return { mode, apply, toggle, restore }
}
