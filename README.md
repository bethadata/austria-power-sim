# Austria Power Simulator

An interactive, browser-based tool for simulating hourly electricity production and consumption in Austria's power system. Explore future renewable energy pathways by adjusting installed capacities, storage technologies, and demand scenarios — and instantly see the resulting energy balance, renewable share, and storage dynamics.

**Live demo:** [bethadata.github.io/austria-power-sim](https://bethadata.github.io/austria-power-sim/)

---

## Features

- **Hourly simulation** of an entire year (8 760 time steps) — supply–demand matching with storage dispatch
- **Configurable generation mix** — Solar PV, Wind Onshore, Hydro Run-of-River, Hydro Reservoir, Pumped Hydro, Biomass, Waste
- **Two storage technologies** — battery storage and hydrogen (electrolyzer → storage → back-conversion)
- **Multiple scenarios** — historical capacity data (2023–2025) and TYNDP 2024 future pathways
- **Key performance indicators** — renewable share (%), annual overshoot and load gap (TWh)
- **Interactive Plotly charts** — time series, annual energy balance, storage state-of-charge, residual load duration curve
- **Static deployment** — runs entirely in the browser, no server required

---

## Tech Stack

| Category | Library / Tool | Version |
|---|---|---|
| Framework | [Vue 3](https://vuejs.org/) | 3.5 |
| Language | TypeScript | ~5.9 |
| Build tool | [Vite](https://vitejs.dev/) | 8.0 |
| UI components | [Vuetify](https://vuetifyjs.com/) | 4.0 |
| Charts | [Plotly.js](https://plotly.com/javascript/) | latest |
| Routing | Vue Router | 5.0 |
| i18n | Vue i18n | 11.4 |
| Icons | Material Design Icons | — |
| Styling | Sass | 1.98 |

---

## Prerequisites

- [Node.js](https://nodejs.org/) **v18 or later** (v22 recommended)
- npm (bundled with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bethadata/austria-power-sim.git
cd austria-power-sim
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---


## Deployment

The project is deployed automatically to **GitHub Pages** via GitHub Actions on every push to `main`.

The workflow is defined in [.github/workflows/deploy.yml](.github/workflows/deploy.yml):


## Project Structure

```
austria-power-sim/
├── public/                     # Static assets served as-is
├── src/
│   ├── main.ts                 # App entry point — registers plugins
│   ├── App.vue                 # Root component
│   ├── router/index.ts         # Route definitions (/, /about, /model)
│   ├── i18n.ts                 # Vue i18n configuration
│   ├── plugins/vuetify.ts      # Vuetify theme (light/dark) setup
│   ├── types/model.ts          # TypeScript interfaces
│   ├── composables/
│   │   └── useModel.ts         # Core simulation engine (reactive state + hourly dispatch)
│   ├── views/
│   │   ├── HomeView.vue        # Main dashboard (controls + charts)
│   │   ├── AboutView.vue       # About, privacy and disclaimer page
│   │   └── ModelView.vue       # Model documentation and limitations
│   ├── components/
│   │   ├── layout/             # AppHeader, AppFooter
│   │   ├── model/              # Input forms, result cards, Plotly chart wrappers
│   │   └── sections/           # IntroCard, BottomInfo
│   ├── locales/
│   │   ├── en/                 # English translations (home, about, models)
│   │   └── de/                 # German translations
│   └── data/
│       ├── timeseries_2023.json  # Hourly generation profiles — 2023
│       ├── timeseries_2024.json  # Hourly generation profiles — 2024
│       ├── timeseries_2025.json  # Hourly generation profiles — 2025
│       ├── powers.json           # Installed capacities per scenario (GW)
│       ├── loads.json            # Demand scaling factors per scenario
│       └── energies.json         # Annual energy reference data
├── .github/workflows/deploy.yml  # CI/CD — build and deploy to GitHub Pages
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## The Simulation Model

The core engine lives in `src/composables/useModel.ts`. It runs a full year of hourly dispatch using reactive Vue state.

### What is simulated

1. **Generation scaling** — User-defined installed capacities (GW) are applied to normalised hourly profiles to produce actual generation time series.
2. **Residual load** — The difference between total demand and total renewable generation each hour.
3. **Battery dispatch** — Charges when there is excess generation; discharges to cover residual load, subject to capacity (GWh) and power (GW) limits.
4. **Hydrogen dispatch** — Electrolyzer converts excess electricity to hydrogen at 70 % efficiency; a gas turbine converts hydrogen back to electricity at 50 % efficiency.
5. **Load gap & overshoot** — Remaining unmet demand and excess generation that could not be stored are accumulated annually.

### Data sources

| Data | Source |
|---|---|
| Hourly generation profiles | [ENTSO-E Transparency Platform](https://transparency.entsoe.eu/) |
| Installed capacities (historic) | [E-Control Austria](https://www.e-control.at/) |
| Installed capacities (future scenarios) | [TYNDP 2024](https://tyndp.entsoe.eu/) |
| Dashboard / validation | [energy-charts.info](https://energy-charts.info/) |

### Known limitations

- No cross-border electricity exchange (Austria only, closed system)
- Copper-plate assumption — no internal grid constraints
- No sector coupling (heat pumps, EVs, industry)
- Hydrogen demand from transport and industry not modelled
- No demand-side flexibility or vehicle-to-grid
- Behind-the-meter PV self-consumption not accounted for

Full documentation is available in the **Model** page of the running application.

---

## Contributing

Feedback, bug reports, and pull requests are welcome. Please open an issue first for larger changes so the approach can be discussed.

---

## License

This project is open source. See [LICENSE](LICENSE) for details.

---

## About

Developed by **bethadata**. The tool is intended for educational and illustrative purposes; it is not a certified planning tool.

The code and some descriptive texts were developed with assistance from AI tools (ChatGPT, Claude Code). All outputs have been reviewed and verified by the author.
