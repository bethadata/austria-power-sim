<template>
  <CardTitleWithTooltip
    title="Energy balance"
    tooltip="Summed up generation and load data."
  />
  <div ref="plot"></div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch, ref } from 'vue'
import Plotly from "plotly.js-dist"
import { useTheme } from 'vuetify'
import { usePlotly } from '../../composables/usePlotly'
import CardTitleWithTooltip from './CardTitleWithTooltip.vue'

const { colors, colorMap, getLayout, namesMap } = usePlotly()

const theme = useTheme()

type BarData = {
  loadTotal: number
  generation: {
    name: string
    total: number
  }[]
}

const props = defineProps<{data: BarData}>()
const plot = ref()

function drawBarChart() {
  if (!props.data) return

  const { loadTotal, generation } = props.data

  const traces = []

  // LOAD (single bar)
  traces.push({
    x: ['Load'],
    y: [loadTotal],
    type: 'bar',
    hovertemplate: '%{y:.3f} TWh',
    name: 'Load',
    marker: { color: colorMap["load"]},
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