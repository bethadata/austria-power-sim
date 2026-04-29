<template>
  <div class="d-flex align-center ga-2">
    <span :class="['title-text', titleClass]">      
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
    type: String,
    default: "text-h2",
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>

.title-text {
  line-height: 1.5;
  font-size: 20px;
}

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