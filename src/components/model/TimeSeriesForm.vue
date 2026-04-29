<template>
  <v-card class="pa-4 pb-0 w-100">
      <CardTitleWithTooltip
        :title="t('timeseries_form.title')"
        :tooltip="t('timeseries_form.tooltip')"
      />
      <v-select
      :label="t('timeseries_form.timeseries_scenario')"
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

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const {loadTimeSeries} = useModel()

const timeseries = [
  { title: "Actual Generation 2024 (ENTSO-E)", value: 'timeseries_2024'},
]

const selectedTimeSeries = ref('timeseries_2024')

async function applyTimeSeries() {
  await loadTimeSeries(selectedTimeSeries.value)
}

// auto-load on mount
onMounted(async () => {
  await applyTimeSeries()
})

</script>