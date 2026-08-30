<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import HelpIcon from '@/components/ui/HelpIcon.vue'
import { useModel } from '@/composables/useModel'

const { t } = useI18n({ useScope: 'global' })
const { summedData } = useModel()

/** One decimal, or an em dash while the scenario is still loading. */
function show(value: number | null | undefined, scale = 1) {
  return value == null ? '—' : (value * scale).toFixed(1)
}

/*
 * The three headline numbers, as tiles rather than as the rows of a v-table.
 * A table put the label and the value on one line at near-equal weight, so the
 * number the whole simulation exists to produce read as a table cell.
 */
const tiles = computed(() => [
  {
    key: 'renewable_share',
    label: t('system_results.renewable_share'),
    tooltip: t('system_results.renewable_share_tooltip'),
    value: show(summedData.value?.renewableShare, 100),
    unit: '%',
    tone: 'text-success',
  },
  {
    key: 'overshoot',
    label: t('system_results.overshoot_energy'),
    tooltip: t('system_results.overshoot_energy_tooltip'),
    value: show(summedData.value?.overshootTWh),
    unit: 'TWh',
    tone: 'text-info',
  },
  {
    key: 'load_gap',
    label: t('system_results.load_gap'),
    tooltip: t('system_results.load_gap_tooltip'),
    value: show(summedData.value?.loadGapTWh),
    unit: 'TWh',
    tone: 'text-error',
  },
])
</script>

<template>
  <v-row dense>
    <v-col v-for="tile in tiles" :key="tile.key" cols="12" sm="4">
      <v-card flat border class="px-4 py-3 h-100">
        <div class="d-flex align-center ga-1">
          <span class="text-body-small text-medium-emphasis text-truncate">{{ tile.label }}</span>
          <HelpIcon :text="tile.tooltip" />
        </div>
        <div class="d-flex align-baseline ga-1 mt-1">
          <span class="text-headline-small font-weight-medium" :class="tile.tone">
            {{ tile.value }}
          </span>
          <span class="text-body-small text-medium-emphasis">{{ tile.unit }}</span>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
