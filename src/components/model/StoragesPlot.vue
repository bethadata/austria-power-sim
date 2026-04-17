<template>
  <CardTitleWithTooltip
    title="Storage charges"
    tooltip="Storage energy contents over simulation period."
  />
  <div ref="plot"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import Plotly from "plotly.js-dist"
import { useTheme } from 'vuetify'
import { usePlotly } from '../../composables/usePlotly'
import CardTitleWithTooltip from './CardTitleWithTooltip.vue'

const { getLayout, generateDateArray, colorMap} = usePlotly()

const theme = useTheme()

const props = defineProps<{
  data: Record<string, { y: number[]}>
}>()

const plot = ref()

function draw() {
  const startDate = new Date('2025-01-01T00:00:00')

  const traces = [
    {
      x: generateDateArray(startDate, 1, props.data["battery"].y.length),
      y: props.data["battery"].y,
      type: 'scatter',
      mode: 'lines',
      name: 'Battery charge',
      line: {
        color: colorMap.battery_charge,
        width: 2,
      },
    },
    {
      x: generateDateArray(startDate, 1, props.data["reservoir_storage"].y.length),
      y: props.data["reservoir_storage"].y,
      type: 'scatter',
      mode: 'lines',
      name: 'Reservoir storage',
      line: {
        color: colorMap.hydro_reservoir_storage_open,
        width: 2,
      },
    },
     {
      x: generateDateArray(startDate, 1, props.data["hydrogen_storage"].y.length),
      y: props.data["hydrogen_storage"].y,
      type: 'scatter',
      mode: 'lines',
      name: 'Hydrogen storage',
      line: {
        color: colorMap.electrolyser_power,
        width: 2,
      },
    },
  ]

  const layout = getLayout({
  xaxis: {
    type: "date"
  },
  yaxis: {
    title: { text: 'Charge (GWh)' },
  },
  })

  Plotly.react(plot.value, traces, layout)
}


onMounted(draw)

watch(
  () => props.data,
  draw,
  { deep: true }
)

watch(
  () => theme.global.name.value,
  draw
)

</script>