declare module 'plotly.js-dist'
declare module 'plotly.js'
declare module '*.vue'

// `vuetify/styles` resolves through the package's exports map to a plain .css
// file, which TypeScript will not resolve for a bare specifier. `tsconfig.app.json`
// keeps `noUncheckedSideEffectImports` on deliberately, so the module is declared
// here rather than the import rewritten to a lib-internal path that would break on
// the next Vuetify layout change.
declare module 'vuetify/styles'

// Injected by vite.config.ts `define`; see the comment there for why the footer
// dates the build rather than the data.
declare const __BUILD_DATE__: string
