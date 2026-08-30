<script setup lang="ts">
import { watch } from 'vue'
import Plotly from 'plotly.js-basic-dist-min'
import { useI18n } from 'vue-i18n'

import PanelCard from '@/components/ui/PanelCard.vue'
import { usePlotPanel } from '@/composables/usePlotPanel'
import { usePlotly } from '@/composables/usePlotly'

const props = withDefaults(
  defineProps<{
    data: Record<string, { y: number[] }>
    height?: number
  }>(),
  { height: 260 },
)

const { t } = useI18n({ useScope: 'global' })
const { getLayout, config, generateDateArray, colorMap } = usePlotly()

const START = new Date('2024-01-01T00:00:00')

function drawInto(target: HTMLElement) {
  const line = (key: string, name: string, color: string) => ({
    x: generateDateArray(START, 1, props.data[key].y.length),
    y: props.data[key].y,
    type: 'scatter',
    mode: 'lines',
    name,
    line: { color, width: 2 },
    hovertemplate: '%{x|%d. %b %H:%M}<br>%{y:.1f} GWh<extra></extra>',
  })

  const traces = [
    line('battery', t('storages_plot.series_battery'), colorMap.battery_charge),
    line('reservoir_storage', t('storages_plot.series_reservoir'), colorMap.hydro_reservoir),
    line('hydrogen_storage', t('storages_plot.series_hydrogen'), colorMap.electrolyzer_power),
  ]

  Plotly.react(
    target,
    traces,
    getLayout({
      xaxis: { type: 'date' },
      yaxis: { title: { text: t('units.energy_gwh') }, automargin: true },
    }),
    config,
  )
}

const { fullscreen, render } = usePlotPanel(drawInto)

watch(() => props.data, render, { deep: true })
</script>

<template>
  <PanelCard
    :title="t('storages_plot.title')"
    :tooltip="t('storages_plot.tooltip')"
    body-class="px-2 pb-2 pt-2"
    v-model:fullscreen="fullscreen"
  >
    <div ref="plot" :style="{ height: `${height}px` }" />

    <template #fullscreen>
      <div ref="plotFullscreen" class="fullscreen-plot" />
    </template>
  </PanelCard>
</template>

<style scoped>
.fullscreen-plot {
  height: calc(100vh - 48px);
  width: 100%;
}
</style>
