import { computed } from 'vue'
import { useTheme } from 'vuetify'

export function usePlotly() {
  const theme = useTheme()

  const isDark = computed(() => theme.global.current.value.dark)

  // 🎨 shared colors
  const colors = [
    '#1976D2',
    '#E53935',
    '#43A047',
    '#FB8C00',
    '#8E24AA',
    '#00ACC1',
  ]

  const colorMap: Record<string, string> = {
  solar: '#ffda8b',
  wind_onshore: '#d2e1cb',
  hydro_river: '#3d3dd3',
  natural_gas: '#fbb078',
  hydro_reservoir: '#afc8ff',
  hydro_pumped_reservoir: '#40b0e9',
  biomass: '#3dad62',
  load: '#323232',
  waste: '#7f6444',
  battery_charge: '#fb8072',
  battery_discharge: '#df6153',
  gas_power: '#fb9140',
  electrolyzer_power: '#ffa35d', 
  }

  const namesMap: Record<string, string> = {
    solar: "Solar",
    wind_onshore: "Wind Onshore",
    hydro_river: "Hydro River",
    hydro_reservoir: 'Hydro reservoir storage',
    hydro_pumped_reservoir: 'Hydro pumped storage',
    load: "Load",
    biomass: "Biomass",
    waste: "Waste",
    battery_charge: "Battery Charge",
    battery_discharge: "Battery Discharge",
    electrolyzer_power: "Electrolyzers",
    gas_power: "H2 gas power"
  }

  // 🎯 shared layout generator
  function getLayout(extra: any = {}) {
    return {
      autosize: true,
      margin: { l: 40, r: 20, t: 20, b: 40 },

      paper_bgcolor: isDark.value ? '#121212' : '#ffffff',
      plot_bgcolor: isDark.value ? '#4b4b4b' : '#ffffff',

      font: {
        color: isDark.value ? '#ffffff' : '#000000',
      },

      xaxis: {
        gridcolor: isDark.value ? '#444' : '#eee',
      },

      yaxis: {
        gridcolor: isDark.value ? '#444' : '#eee',
      },

      legend: {
        orientation: 'h',
      },

      ...extra, 
    }
  }

  function generateDateArray(start: Date, stepHours: number, length: number) {
  return Array.from({ length }, (_, i) => {
    return new Date(start.getTime() + i * stepHours * 60 * 60 * 1000)
  })
  }

  return {
    colors,
    colorMap,
    isDark,
    getLayout,
    generateDateArray,
    namesMap
  }
}