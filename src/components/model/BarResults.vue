<script setup lang="ts">
import { watch } from 'vue'
import Plotly from 'plotly.js-basic-dist-min'
import { useI18n } from 'vue-i18n'

import PanelCard from '@/components/ui/PanelCard.vue'
import { usePlotPanel } from '@/composables/usePlotPanel'
import { usePlotly } from '@/composables/usePlotly'

type Entry = { name: string; total: number }

const props = withDefaults(
  defineProps<{
    data: { loadEntries: Entry[]; generation: Entry[] }
    height?: number
  }>(),
  { height: 260 },
)

const { t } = useI18n({ useScope: 'global' })
const { colors, colorMap, ink, getLayout, config, namesMap } = usePlotly()

function drawInto(target: HTMLElement) {
  // `load` is the reference bar rather than a technology, so it takes the
  // chart's ink; see usePlotly.ts.
  const fill = (name: string, index: number) =>
    name === 'load' ? ink(0.55) : (colorMap[name] ?? colors[index % colors.length])

  const bar = (category: string) => (entry: Entry, index: number) => ({
    x: [category],
    y: [entry.total],
    type: 'bar',
    name: namesMap[entry.name] ?? entry.name,
    marker: { color: fill(entry.name, index) },
    hovertemplate: '%{fullData.name}<br>%{y:.1f} TWh<extra></extra>',
  })

  const traces = [
    ...props.data.loadEntries.map(bar(t('bar_results.category_load'))),
    ...props.data.generation.map(bar(t('bar_results.category_generation'))),
  ]

  Plotly.react(
    target,
    traces,
    getLayout({
      barmode: 'stack',
      // No legend: this panel repeats the series of the load-and-generation
      // chart directly above it, which carries one, and at this width a legend
      // would take more room than the bars. `legend: { visible: false }` is not
      // a Plotly option -- the layout flag is `showlegend`, and the old value
      // did nothing.
      showlegend: false,
      margin: { l: 52, r: 16, t: 12, b: 32 },
      yaxis: { title: { text: t('units.energy_twh') } },
    }),
    config,
  )
}

const { fullscreen, render } = usePlotPanel(drawInto)

watch(() => props.data, render, { deep: true })
</script>

<template>
  <PanelCard
    :title="t('bar_results.title')"
    :tooltip="t('bar_results.tooltip')"
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
