import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import Plotly from 'plotly.js-basic-dist-min'
import { useTheme } from 'vuetify'

/**
 * The plumbing every chart panel shares: two draw targets (in-card and
 * fullscreen), a redraw on theme change, and a redraw on resize.
 *
 * The resize part is what makes the sidebar layout work at all. Plotly sizes a
 * chart once, at draw time, from the container's offsetWidth; `responsive: true`
 * only listens to *window* resizes. Opening or closing the navigation drawer
 * changes a card's width without changing the window's, so every chart kept its
 * old width and either overflowed the card or left a gap beside it.
 *
 * The two graph divs are picked up by name -- the caller writes `ref="plot"` and
 * `ref="plotFullscreen"` in its template and nothing else. A returned ref bound
 * with a string `ref` attribute reads as an unused local to `noUnusedLocals`,
 * which is a build error here.
 *
 * `draw` is called with the element to draw into, so the caller does not have to
 * know which of the two targets is live.
 */
export function usePlotPanel(draw: (target: HTMLElement) => void) {
  const plot = useTemplateRef<HTMLElement>('plot')
  const plotFullscreen = useTemplateRef<HTMLElement>('plotFullscreen')
  const fullscreen = ref(false)
  const theme = useTheme()

  let observer: ResizeObserver | null = null

  function render() {
    if (plot.value) draw(plot.value)
    if (fullscreen.value && plotFullscreen.value) draw(plotFullscreen.value)
  }

  onMounted(() => {
    render()

    const target = plot.value
    if (!target) return

    // Width only: the height is set by the card, and observing it too makes the
    // redraw re-trigger itself through Plotly's own layout write.
    let last = target.offsetWidth
    observer = new ResizeObserver(() => {
      const width = target.offsetWidth
      if (width === last || width === 0) return
      last = width
      Plotly.Plots.resize(target)
    })
    observer.observe(target)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    // Plotly attaches listeners and a canvas context per graph div; a route
    // change without this leaks both.
    if (plot.value) Plotly.purge(plot.value)
    if (plotFullscreen.value) Plotly.purge(plotFullscreen.value)
  })

  watch(fullscreen, (open) => {
    if (open) void nextTick(render)
  })

  // A tick late on purpose: Vuetify swaps the theme's CSS custom properties
  // during the same flush, and getLayout() reads --v-theme-on-surface out of
  // the DOM. Redrawing synchronously would paint the chart in the ink of the
  // theme being left.
  watch(() => theme.name.value, () => void nextTick(render))

  return { fullscreen, render }
}
