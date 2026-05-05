<template>
  <CardTitleWithTooltip
    :title="t('bar_results.title')"
    :tooltip="t('bar_results.tooltip')"
  />
  <div ref="plot"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import Plotly from "plotly.js-dist"
import { useTheme } from 'vuetify'
import { usePlotly } from '../../composables/usePlotly'
import CardTitleWithTooltip from './CardTitleWithTooltip.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const { colors, colorMap, getLayout, namesMap } = usePlotly()

const theme = useTheme()

type BarData = {
  loadEntries: {
    name: string,
    total: number
  }[],
  generation: {
    name: string,
    total: number
  }[]
}

const props = defineProps<{data: BarData}>()
const plot = ref()

function drawBarChart() {
  if (!props.data) return

  const { loadEntries, generation } = props.data

  const traces: any[] = []

  loadEntries.forEach((g, index) => {
    traces.push({
      x: ['Load'],
      y: [g.total],
      type: 'bar',
      hovertemplate: '%{y:.3f} TWh',
      name: namesMap[g.name],
      marker: {
        color: colorMap[g.name] ?? colors[index % colors.length],
      },
    })
  })

  // GENERATION (stacked bar)
  generation.forEach((g, index) => {
    traces.push({
      x: ['Generation'],
      y: [g.total],
      type: 'bar',
      hovertemplate: '%{y:.3f} TWh',
      name: namesMap[g.name],
      marker: {
        color: colorMap[g.name] ?? colors[index % colors.length],
      },
    })
  })

  const layout = getLayout({
    barmode: 'stack', 
    title: 'Load vs Generation',
    legend: {visible: false},
    yaxis: {
        title: { text: 'Energy (TWh)' },
    },
    })

  Plotly.react(plot.value, traces, layout)
}

onMounted(drawBarChart)

watch(
  () => props.data,
  drawBarChart,
  { deep: true }
)

watch(
  () => theme.global.name.value,
  drawBarChart
)

</script>