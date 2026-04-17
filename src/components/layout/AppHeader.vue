<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDarkMode = computed(() => theme.global.current.value.dark)

function toggleDarkMode() {
  const newTheme = isDarkMode.value ? 'light' : 'dark'
  theme.change(newTheme)

  // persist setting
  localStorage.setItem('darkMode', newTheme)
}

// load saved theme
onMounted(() => {
  const saved = localStorage.getItem('darkMode')
  if (saved) {
    theme.change(saved)
  }
})
</script>

<template>
  <v-app-bar app color="surface" elevation="3" rounded="lg">
    <v-toolbar-title>Austria Power Simulator</v-toolbar-title>

    <v-spacer />

    <v-btn to="/" variant="text">Home</v-btn>
    <v-btn to="/model" variant="text">Model & Data</v-btn>
    <v-btn to="/about" variant="text">About</v-btn>

    <v-btn @click="toggleDarkMode" variant="tonal">
      {{ isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode" }}
    </v-btn>
  </v-app-bar>
</template>