<template>
  <CardTitleWithTooltip
    title="Residual load duration curve"
    tooltip="Shows how many hours a certain load gap exists. Positive means renewables don't meet demand, negative indicates a surplus.."
  />
  <div ref="plot"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import Plotly from "plotly.js-dist"
import { useTheme } from 'vuetify'
import { usePlotly } from '../../composables/usePlotly'
import CardTitleWithTooltip from './CardTitleWithTooltip.vue'

const { getLayout, colorMap} = usePlotly()

const theme = useTheme()

const props = defineProps<{
  data: Record<string, { x: number[], y: number[]}>
}>()

const plot = ref()

function draw() {
  const traces = [
    {
      x: props.data["residual_base"].x,
      y: props.data["residual_base"].y,
      type: 'scatter',
      mode: 'lines',
      name: 'Residual Load',
      line: {
        color: colorMap.load,
        width: 2,
      },
    },
    {
      x: props.data["residual_storages"].x,
      y: props.data["residual_storages"].y,
      type: 'scatter',
      mode: 'lines',
      name: 'Residual Load incl. Battery + H2',
      line: {
        color: colorMap.battery_charge,
        width: 2,
      },
    },
  ]

  const layout = getLayout({
  xaxis: {
  },
  yaxis: {
    title: { text: 'Power (GW)' },
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