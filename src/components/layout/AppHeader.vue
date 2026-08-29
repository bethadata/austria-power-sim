<template>
  <v-app-bar app color="surface" elevation="3" rounded="lg">
    <v-toolbar-title>
      <router-link to="/"> Austria Power Simulator </router-link>
    </v-toolbar-title>

    <v-spacer />

    <v-btn to="/" variant="text">{{ t('header.home') }}</v-btn>
    <v-btn to="/model" variant="text">{{ t('header.model') }}</v-btn>
    <v-btn to="/about" variant="text">{{ t('header.about') }}</v-btn>

    <v-btn @click="toggleLanguage" variant="text">
      <span :class="locale === 'en' ? 'fi fi-de mr-1' : 'fi fi-gb mr-1'"></span>
      {{ locale === 'en' ? 'DE' : 'EN' }}
    </v-btn>

    <v-btn @click="toggleDarkMode" variant="tonal">
      <v-icon start>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      {{ isDarkMode ? t('header.light') : t('header.dark') }}
    </v-btn>
  </v-app-bar>
</template>


<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

const theme = useTheme()
const isDarkMode = computed(() => theme.current.value.dark)

function toggleDarkMode() {
  const newTheme = isDarkMode.value ? 'light' : 'dark'
  theme.change(newTheme)

  // persist setting
  localStorage.setItem('darkMode', newTheme)
}

const { t, locale } = useI18n({ useScope: 'global' })

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'de' : 'en'
  localStorage.setItem('lang', locale.value)
}

// load saved theme
onMounted(() => {
  const saved = localStorage.getItem('darkMode')
  if (saved) {
    theme.change(saved)
  }
})
</script>

<style scoped>
.v-btn--active {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}
</style>
