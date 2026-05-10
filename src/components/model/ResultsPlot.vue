<template>
  <div class="d-flex align-center justify-space-between">
    <CardTitleWithTooltip
      :title="t('results_plot.title')"
      :tooltip="t('results_plot.tooltip')"
      :show-divider="false"
    />
    <v-tooltip location="top" :open-on-hover="true">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon="mdi-fullscreen"
          variant="text"
          size="small"
          density="comfortable"
          class="mr-1"
          @click="dialog = true"
        />
      </template>
      Fullscreen
    </v-tooltip>
  </div>
  <v-divider class="mb-4" />
  <div ref="plot"></div>

  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar density="compact" color="surface">
        <v-toolbar-title>{{ t('results_plot.title') }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-toolbar>
      <div ref="plotFullscreen" style="height: calc(100vh - 48px); width: 100%"></div>
    </v-card>
  </v-dialog>
</template>


<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue'
import Plotly from "plotly.js-dist"
import { useTheme } from 'vuetify'
import { usePlotly } from '../../composables/usePlotly'
import CardTitleWithTooltip from './CardTitleWithTooltip.vue'

import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })

const { colors, colorMap, getLayout, generateDateArray, namesMap} = usePlotly()

const theme = useTheme()

const props = defineProps<{
  data: Record<string, { y: number[], type: string }>
}>()

const plot = ref()
const plotFullscreen = ref()
const dialog = ref(false)

function buildTraces() {
  const startDate = new Date('2024-01-01T00:00:00')

  return Object.entries(props.data).map(([name, obj], index) => {
    const yValues = obj.y
    const x = generateDateArray(startDate, 1, yValues.length)
    const negativeTypes = ["battery_charge", "electrolyzer_power"]
    const type = obj.type

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
        hovertemplate: '%{x|%d. %b %H:%M}<br>%{y:.2f} GW<extra></extra>',
      }
    }

    if (type === 'generation') {
      return {
        x,
        y: yValues,
        type: 'scatter',
        mode: 'none',
        stackgroup: 'one',
        name: namesMap[name],
        fillcolor: (colorMap[name] ?? colors[index % colors.length]),
        hovertemplate: '%{x|%d. %b %H:%M}<br>%{y:.2f} GW<extra></extra>',
      }
    }

    if (negativeTypes.includes(type)) {
      return {
        x,
        y: yValues.map(v => -v),
        type: 'scatter',
        mode: 'none',
        stackgroup: 'two',
        name: namesMap[name],
        fillcolor: colorMap[name] ?? '#888',
        hovertemplate: '%{x|%d. %b %H:%M}<br>%{y:.2f} GW<extra></extra>',
      }
    }

    if (type === 'battery_discharge') {
      return {
        x,
        y: yValues,
        type: 'scatter',
        mode: 'none',
        stackgroup: 'one',
        name: namesMap[name],
        fillcolor: colorMap[name] ?? '#444',
        hovertemplate: '%{x|%d. %b %H:%M}<br>%{y:.2f} GW<extra></extra>',
      }
    }

    return null
  }).filter(Boolean)
}

function drawIn(target: HTMLElement) {
  const layout = getLayout({
    xaxis: { type: 'date' },
    yaxis: { title: { text: "Power (GW)" } },
  })
  Plotly.react(target, buildTraces(), layout)
}

function draw() {
  drawIn(plot.value)
}

onMounted(draw)

watch(
  () => props.data,
  () => {
    draw()
    if (dialog.value) drawIn(plotFullscreen.value)
  },
  { deep: true }
)

watch(
  () => theme.global.name.value,
  () => {
    draw()
    if (dialog.value) drawIn(plotFullscreen.value)
  }
)

watch(dialog, (open) => {
  if (open) nextTick(() => drawIn(plotFullscreen.value))
})
</script>
