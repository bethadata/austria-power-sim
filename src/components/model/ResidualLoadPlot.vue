<script setup lang="ts">
import { watch } from 'vue'
import Plotly from 'plotly.js-basic-dist-min'
import { useI18n } from 'vue-i18n'

import PanelCard from '@/components/ui/PanelCard.vue'
import { usePlotPanel } from '@/composables/usePlotPanel'
import { usePlotly } from '@/composables/usePlotly'

const props = withDefaults(
  defineProps<{
    data: Record<string, { x: number[]; y: number[] }>
    height?: number
  }>(),
  { height: 260 },
)

const { t } = useI18n({ useScope: 'global' })
const { getLayout, config, colorMap, ink } = usePlotly()

function drawInto(target: HTMLElement) {
  const traces = [
    {
      x: props.data.residual_base.x,
      y: props.data.residual_base.y,
      type: 'scatter',
      mode: 'lines',
      name: t('residualload_plot.series_base'),
      line: { color: ink(0.85), width: 2 },
      hovertemplate: '%{x:,d} h<br>%{y:.2f} GW<extra></extra>',
    },
    {
      x: props.data.residual_storages.x,
      y: props.data.residual_storages.y,
      type: 'scatter',
      mode: 'lines',
      name: t('residualload_plot.series_storage'),
      line: { color: colorMap.battery_charge, width: 2 },
      hovertemplate: '%{x:,d} h<br>%{y:.2f} GW<extra></extra>',
    },
  ]

  Plotly.react(
    target,
    traces,
    getLayout({
      xaxis: { title: { text: t('units.hours') } },
      yaxis: { title: { text: t('units.power_gw') }, zeroline: true },
    }),
    config,
  )
}

const { fullscreen, render } = usePlotPanel(drawInto)

watch(() => props.data, render, { deep: true })
</script>

<template>
  <PanelCard
    :title="t('residualload_plot.title')"
    :tooltip="t('residualload_plot.tooltip')"
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
