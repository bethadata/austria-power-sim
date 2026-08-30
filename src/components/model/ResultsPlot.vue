<script setup lang="ts">
import { watch } from 'vue'
import Plotly from 'plotly.js-basic-dist-min'
import { useI18n } from 'vue-i18n'

import PanelCard from '@/components/ui/PanelCard.vue'
import { usePlotPanel } from '@/composables/usePlotPanel'
import { usePlotly } from '@/composables/usePlotly'

const props = withDefaults(
  defineProps<{
    data: Record<string, { y: number[]; type: string }>
    height?: number
  }>(),
  { height: 340 },
)

const { t } = useI18n({ useScope: 'global' })
const { colors, colorMap, ink, getLayout, config, generateDateArray, namesMap } = usePlotly()

// The x axis is a calendar year only so the hover label can read "12. Mar 08:00";
// the profiles are one normalized year, not a dated series.
const START = new Date('2024-01-01T00:00:00')
const HOVER = '%{x|%d. %b %H:%M}<br>%{y:.2f} GW<extra></extra>'

function buildTraces() {
  return Object.entries(props.data)
    .map(([name, obj], index) => {
      const x = generateDateArray(START, 1, obj.y.length)
      const color = colorMap[name] ?? colors[index % colors.length]

      if (obj.type === 'load') {
        return {
          x,
          y: obj.y,
          type: 'scatter',
          mode: 'lines',
          name: namesMap[name],
          line: { color: ink(0.85), width: 1 },
          hovertemplate: HOVER,
        }
      }

      if (obj.type === 'generation' || obj.type === 'battery_discharge') {
        return {
          x,
          y: obj.y,
          type: 'scatter',
          mode: 'none',
          stackgroup: 'one',
          name: namesMap[name],
          fillcolor: color,
          hovertemplate: HOVER,
        }
      }

      // Consumption by storage is drawn below the axis, in its own stack.
      if (obj.type === 'battery_charge' || obj.type === 'electrolyzer_power') {
        return {
          x,
          y: obj.y.map((v) => -v),
          type: 'scatter',
          mode: 'none',
          stackgroup: 'two',
          name: namesMap[name],
          fillcolor: color,
          hovertemplate: HOVER,
        }
      }

      return null
    })
    .filter(Boolean)
}

function drawInto(target: HTMLElement) {
  const layout = getLayout({
    xaxis: { type: 'date' },
    yaxis: { title: { text: t('units.power_gw') } },
  })
  Plotly.react(target, buildTraces(), layout, config)
}

const { fullscreen, render } = usePlotPanel(drawInto)

watch(() => props.data, render, { deep: true })
</script>

<template>
  <PanelCard
    :title="t('results_plot.title')"
    :tooltip="t('results_plot.tooltip')"
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
