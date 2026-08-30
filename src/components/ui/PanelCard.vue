<script setup lang="ts">
import { useSlots } from 'vue'

import HelpIcon from '@/components/ui/HelpIcon.vue'

withDefaults(
  defineProps<{
    title: string
    tooltip?: string
    /** Padding for the body. Charts want it tight, forms want it comfortable. */
    bodyClass?: string
    /** Heading level, so a panel nested under a section heading stays in order. */
    tag?: string
  }>(),
  { tooltip: '', bodyClass: 'px-4 pb-4 pt-3', tag: 'h3' },
)

/**
 * Set by the fullscreen button. The chart owns the flag rather than this card,
 * because the chart is what has to redraw into the dialog's own graph div --
 * Plotly cannot move a rendered plot between two elements.
 */
const fullscreen = defineModel<boolean>('fullscreen', { default: false })

const slots = useSlots()
</script>

<template>
  <!-- `flat border` throughout: elevation on a page of a dozen panels reads as
       noise, and the border is what separates the card from the plane in both
       themes. `h-100` lets two panels in one row match heights. -->
  <v-card flat border class="h-100 d-flex flex-column">
    <div class="d-flex align-center ga-2 px-4 pt-3 pb-2">
      <component :is="tag" class="text-title-small text-truncate">{{ title }}</component>
      <HelpIcon v-if="tooltip" :text="tooltip" />

      <v-spacer />

      <slot name="actions" />

      <v-btn
        v-if="slots.fullscreen"
        icon="mdi-fullscreen"
        variant="text"
        size="small"
        density="comfortable"
        :aria-label="`${title} — fullscreen`"
        @click="fullscreen = true"
      />
    </div>

    <v-divider />

    <div class="flex-grow-1" :class="bodyClass">
      <slot />
    </div>

    <v-dialog
      v-if="slots.fullscreen"
      v-model="fullscreen"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar density="compact" color="surface">
          <v-toolbar-title class="text-title-medium">{{ title }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="fullscreen = false" />
        </v-toolbar>
        <slot name="fullscreen" />
      </v-card>
    </v-dialog>
  </v-card>
</template>
