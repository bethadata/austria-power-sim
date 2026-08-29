<template>
  <div class="d-flex align-center ga-2">
    <span :class="titleClass">
      {{ title }}
    </span>

    <v-tooltip
      location="top"
      open-on-click
      :open-on-hover="true"
    >
      <template #activator="{ props }">
        <v-icon
          v-bind="props"
          size="18"
          class="help-icon"
        >
          mdi-help-circle-outline
        </v-icon>
      </template>

      {{ tooltip }}
    </v-tooltip>
  </div>

  <v-divider v-if="showDivider" class="mb-4"></v-divider>

</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  tooltip: {
    type: String,
    required: true,
  },
  titleClass: {
    // Vuetify 4's Material 3 scale. title-large is what v-card-title itself uses,
    // so these hand-built titles sit at the same size as Vuetify's own.
    type: String,
    default: "text-title-large",
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>

.help-icon {
  opacity: 0.7;
  cursor: pointer;

  /* 🔧 Alignment fix */
  display: flex;
  align-items: center;

  /* fine-tune vertical alignment */
  transform: translateY(-1px);
}
</style>