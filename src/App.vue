<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

import AppFooter from '@/components/layout/AppFooter.vue'
import { useAppTheme } from '@/composables/useAppTheme'

const { mode, toggle, restore } = useAppTheme()
const { t, locale } = useI18n({ useScope: 'global' })
const display = useDisplay()

// Open on desktop, closed on phones -- a 240px rail over a 360px viewport is
// the whole screen.
const drawer = ref(!display.mobile.value)

const NAV = [
  { to: '/', key: 'home', icon: 'mdi-view-dashboard-outline' },
  { to: '/model', key: 'model', icon: 'mdi-function-variant' },
  { to: '/about', key: 'about', icon: 'mdi-information-outline' },
]

// v-btn-toggle emits the raw value, so narrow it here rather than casting at
// the call site.
function switchLocale(next: unknown) {
  if (next !== 'de' && next !== 'en') return
  locale.value = next
  localStorage.setItem('lang', next)
  document.documentElement.lang = next
}

onMounted(() => {
  restore()
  document.documentElement.lang = locale.value
})
</script>

<template>
  <v-app>
    <v-app-bar flat density="comfortable" border="b">
      <v-app-bar-nav-icon :aria-label="t('nav.menu')" @click="drawer = !drawer" />
      <!-- No v-spacer beside it: v-app-bar-title is itself a flex-grow item, so
           a spacer splits the free space with it and the title truncated to
           "Austri..." on a phone while half the bar stayed empty. -->
      <v-app-bar-title class="font-weight-medium">{{ t('app.title') }}</v-app-bar-title>

      <v-btn-toggle
        :model-value="locale"
        density="compact"
        variant="outlined"
        divided
        mandatory
        class="mr-2"
        :aria-label="t('nav.language')"
        @update:model-value="switchLocale"
      >
        <v-btn value="de" size="small">DE</v-btn>
        <v-btn value="en" size="small">EN</v-btn>
      </v-btn-toggle>

      <v-btn
        :icon="mode === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        :aria-label="t('nav.theme')"
        @click="toggle"
      />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :width="232">
      <v-list nav density="comfortable">
        <v-list-item
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="t(`header.${item.key}`)"
          color="primary"
        />
      </v-list>
    </v-navigation-drawer>

    <!--
      The footer lives inside v-main, not beside it. Vuetify offsets v-main for
      the navigation drawer; a footer outside the layout starts at x=0 instead,
      so its first ~230px disappear behind the rail.
    -->
    <v-main>
      <router-view />
      <AppFooter />
    </v-main>
  </v-app>
</template>
