import { createI18n } from 'vue-i18n'

import enAbout from './locales/en/about_en.json'
import enSystem from './locales/en/home_en.json'
import enCommon from './locales/en/models_en.json'

import deAbout from './locales/de/about_de.json'
import deSystem from './locales/de/home_de.json'
import deCommon from './locales/de/models_de.json'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      ...enAbout,
      ...enSystem,
      ...enCommon,
    },
    de: {
      ...deAbout,
      ...deSystem,
      ...deCommon,
    },
  },
})