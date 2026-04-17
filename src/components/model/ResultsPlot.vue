<template>
    <CardTitleWithTooltip
    title="Load and generation"
    tooltip="Shows the hourly load and generation profiles of technologies. 
    Normalized timeseries are scaled to the power-values set under System data."
  />
  <div ref="plot"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import Plotly from "plotly.js-dist"
import { useTheme } from 'vuetify'
import { usePlotly } from '../../composables/usePlotly'
import CardTitleWithTooltip from './CardTitleWithTooltip.vue'

const { colors, colorMap, getLayout, generateDateArray, namesMap} = usePlotly()

const theme = useTheme()

const props = defineProps<{
  data: Record<string, { y: number[], type: string }>
}>()

const plot = ref()

function draw() {
  const startDate = new Date('2025-01-01T00:00:00')

  const traces = Object.entries(props.data).map(([name, obj], index) => {
    const yValues = obj.y
    const x = generateDateArray(startDate, 1, yValues.length)
    const negativeTypes = ["battery_charge", "electrolyzer_power"]
    const type = obj.type

    // LOAD → black line
    if (type === 'load') {
      return {
        x,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: namesMap[name],
        line: {
          color: colorMap[name] ?? colors[index % colors.length],
          width: 1,
        },
      }
    }    
    
    // GENERATION → stacked area
    else if (type == "generation") {
    return {
          x,
          y: yValues,
          type: 'scatter',
          mode: 'none',
          stackgroup: 'one',
          name: namesMap[name],
          fillcolor: (colorMap[name] ?? colors[index % colors.length]), 
    }
    }

    else if (negativeTypes.includes(type)) {
      return {
        x,
        y: yValues.map(v => -v), // negative = consumption
        type: 'scatter',
        mode: 'none',
        stackgroup: 'two',
        name: namesMap[name],
        fillcolor: colorMap[name] ?? '#888',
      }
    }

  else if (type === 'battery_discharge') {
    return {
      x,
      y: yValues,
      type: 'scatter',
      mode: 'none',
      stackgroup: 'one', // same as generation
      name: namesMap[name],
      fillcolor: colorMap[name] ?? '#444',
    }
  }
 
    return null
  }).filter(Boolean) // removes null/undefined


  const layout = getLayout({
  xaxis: {
    type: 'date',
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