/**
 * Chart ink, taken from the live Vuetify theme.
 *
 * Read as the `--v-theme-on-surface` custom property rather than from
 * `theme.current.value.colors`, which does not carry the computed `on-*`
 * entries -- reading it there yielded `undefined`, Plotly silently fell back to
 * its own defaults (#444 text on near-white gridlines), and the dark theme drew
 * white gridlines over the series. The property is an `r,g,b` triplet, which is
 * why it is composed into rgba() here instead of being used directly.
 */
function themeInk(alpha: number): string {
  const triplet = getComputedStyle(document.body).getPropertyValue('--v-theme-on-surface').trim()
  return `rgba(${triplet || '0,0,0'}, ${alpha})`
}

export function usePlotly() {
  // Fallback ramp for a series with no entry in colorMap.
  const colors = ['#1976D2', '#E53935', '#43A047', '#FB8C00', '#8E24AA', '#00ACC1']

  const colorMap: Record<string, string> = {
    solar: '#ffda8b',
    wind_onshore: '#d2e1cb',
    hydro_river: '#3d3dd3',
    natural_gas: '#fbb078',
    hydro_reservoir: '#afc8ff',
    hydro_pumped_reservoir: '#40b0e9',
    biomass: '#3dad62',
    waste: '#7f6444',
    battery_charge: '#fb8072',
    battery_discharge: '#df6153',
    gas_power: '#fb9140',
    electrolyzer_power: '#ffa35d',
  }

  /*
   * Load is not a technology, it is the reference the technologies are measured
   * against, so it wears the chart's ink rather than a series colour. It used to
   * be a hardcoded #323232, which is a black line on a black card in dark mode.
   */
  const ink = themeInk

  const namesMap: Record<string, string> = {
    solar: 'Solar',
    wind_onshore: 'Wind Onshore',
    hydro_river: 'Hydro River',
    hydro_reservoir: 'Hydro reservoir storage',
    hydro_pumped_reservoir: 'Hydro pumped storage',
    load: 'Load',
    biomass: 'Biomass',
    waste: 'Waste',
    battery_charge: 'Battery Charge',
    battery_discharge: 'Battery Discharge',
    electrolyzer_power: 'Electrolyzers',
    gas_power: 'H2 gas power',
  }

  /**
   * Shared layout.
   *
   * Paper and plot backgrounds are transparent so the chart takes the colour of
   * the card behind it. They used to be hardcoded (#ffffff / #121212 paper,
   * #4b4b4b plot), which painted a light-grey rectangle inside the dark card and
   * a white one inside the light card the moment the theme surfaces changed.
   * Ink and grid come from the Vuetify theme for the same reason.
   */
  function getLayout(extra: Record<string, any> = {}) {
    return {
      autosize: true,
      margin: { l: 52, r: 16, t: 8, b: 40 },

      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',

      font: { color: themeInk(0.82), size: 12 },
      hoverlabel: { font: { size: 12 } },

      ...extra,

      // Merged after `extra` so a caller can set `title`/`type`/`range` on an
      // axis without having to restate the grid colour every time.
      xaxis: { gridcolor: themeInk(0.12), zerolinecolor: themeInk(0.28), ...extra.xaxis },
      yaxis: { gridcolor: themeInk(0.12), zerolinecolor: themeInk(0.28), ...extra.yaxis },

      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.02,
        xanchor: 'left',
        x: 0,
        font: { size: 11 },
        ...extra.legend,
      },
    }
  }

  /** Plotly's mode bar, trimmed to what is useful on these charts. */
  const config = {
    displaylogo: false,
    responsive: true,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d', 'toggleSpikelines'],
  }

  function generateDateArray(start: Date, stepHours: number, length: number) {
    return Array.from({ length }, (_, i) => new Date(start.getTime() + i * stepHours * 3600_000))
  }

  return { colors, colorMap, ink, getLayout, config, generateDateArray, namesMap }
}
