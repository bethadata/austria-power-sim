<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <v-tooltip location="top" open-on-click :open-on-hover="true" max-width="360">
    <template #activator="{ props }">
      <!-- `tabindex`/`role` rather than a bare icon: the tooltip carries the
           only explanation a field has, and a mouse hover is not a way to read
           it from a keyboard. -->
      <v-icon
        v-bind="props"
        size="17"
        class="help-icon"
        role="button"
        tabindex="0"
        aria-label="?"
      >
        mdi-help-circle-outline
      </v-icon>
    </template>
    {{ text }}
  </v-tooltip>
</template>

<style scoped>
.help-icon {
  opacity: 0.55;
  cursor: help;
  transition: opacity 120ms ease;
}

.help-icon:hover,
.help-icon:focus-visible {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}
</style>
