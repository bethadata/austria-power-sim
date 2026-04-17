<template>
  <v-card class="pa-4 w-100">
    <CardTitleWithTooltip
        title="Timeseries"
        tooltip="Choose between actual/historic generation timeseries and TYNDP-profiles. Be careful with historic data."
      />
      <v-select
      label="Timeseries Scenario"
      :items="timeseries"
      item-title="title"
      item-value="value"
      v-model="selectedTimeSeries"
      @update:modelValue="applyTimeSeries"
      />
  </v-card>
</template>

<script setup lang="ts">

import { ref, onMounted} from 'vue'
import { useModel } from '../../composables/useModel'
import CardTitleWithTooltip from './CardTitleWithTooltip.vue'

const {loadTimeSeries} = useModel()

const timeseries = [
  { title: 'Actual Generation 2025', value: 'timeseries_2025'},
  { title: 'Actual Generation 2024', value: 'timeseries_2024'},
]

const selectedTimeSeries = ref('timeseries_2025')

async function applyTimeSeries() {
  await loadTimeSeries(selectedTimeSeries.value)
}

// auto-load on mount
onMounted(async () => {
  await applyTimeSeries()
})

</script>