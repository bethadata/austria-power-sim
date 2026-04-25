import { ref, computed} from 'vue'

type Trace = {y: number[], type: string}
type TraceSet = Record<string, Trace>
type Params = Record<string, number>
type PowersByScenario = Record<string, Params>
type LoadScenario = Record<string, number>

// --- STATE ---

// Timeseries: 
const baseData = ref<TraceSet | null>(null) // timeseries data 
const timeseriesModules = import.meta.glob<{ default: TraceSet }>('../data/*.json')

// Powers: 
const powers = ref<Params>({})
const powersData = ref<PowersByScenario | null>(null)
const powerModules = import.meta.glob<{ default: PowersByScenario }>('../data/*.json')

// Load: 
const load = ref<number>(0);
const loadModules = import.meta.glob<{ default: LoadScenario }>('../data/*.json')
const loadData = ref<LoadScenario | null>(null)

// Battery: 
const useBatteries = ref(false)
const batteryData = ref<Params>({})
batteryData.value = {
  "capacity": 0,
  "power": 0
}

// Hydrogen: 
const useHydrogen = ref(false)
const hydrogenData = ref<Params>({})
hydrogenData.value = {
  "storage_capacity": 0,
  "electrolyser_power": 0,
  "gas_power": 0
}

// scaleMap - match Timeseries and Powers for scaling 
const scaleMap: Record<string, string> = {
  "solar": "solar_power",
  "wind_onshore": "wind_onshore_power",
  "hydro_river": "hydro_river_power",
  "hydro_reservoir_storage_open": "hydro_reservoir_power",
  "hydro_pumped_storage_open": "hydro_pumped_reservoir_power",
  "biomass": "biomass_power",
  "waste": "waste_power"
}


// --- ACTIONS ---
// Load Timeseries - load everytime anew 
async function loadTimeSeries(name: string) {
  const path = `../data/${name}.json`
  const loader = timeseriesModules[path]

  if (!loader) {throw new Error(`Preset ${name} not found`)}

  const module = await loader()
  baseData.value = module.default
}

// Load Powers - load only once 
async function loadPowersData() {
  if (powersData.value) return // in case already loaded

  const loader = powerModules['../data/powers.json']

  if (!loader) throw new Error('Powers file not found')

  const module = await loader()
  powersData.value = module.default
}

// Set powers  
function setPowerScenario(scenario: string) {
  if (!powersData.value) return

  const selected = powersData.value[scenario]

  if (!selected) {throw new Error(`Scenario ${scenario} not found`)}

  powers.value = { ...selected }
}

// Load Load - load only once 
async function loadLoadData() {
  if (loadData.value) return // in case already loaded

  const loader = loadModules['../data/loads.json']

  if (!loader) throw new Error('Powers file not found')

  const module = await loader()
  loadData.value = module.default
}

// Set load 
function setLoadScenario(scenario: string) {
  if (!loadData.value) return

  const selected = loadData.value[scenario]

  if (!selected) {throw new Error(`Scenario ${scenario} not found`)}

  load.value = selected
}


// --- COMPUTED: modified curves ---
const modifiedData = computed(() => {
  if (!baseData.value) return null

  const result: TraceSet = {}

  Object.entries(baseData.value).forEach(([name, trace]) => {
    const type = trace.type
    const load_scale = load.value

    // scale load with sum
    if (type === 'load') {
      result[name] = { 
        y: trace.y.map(v => v * load_scale),
        type: type 
      }
      return
    }

    // normal scaling for generation
    const key = scaleMap[name]
    const power = key ? powers.value[key] ?? 1 : 1

    result[name] = {
      y: trace.y.map(v => v * power),
      type: type
    }
    })
  return result
})

// --- COMPUTED: residual load curve ---
const residualLoadCurve = computed(() => {
  if (!modifiedData.value) return null

  const traces = Object.values(modifiedData.value)

  // separate load and generation
  const loadTrace = traces.find(t => t.type === 'load')
  const generationTraces = traces.filter(t => t.type === 'generation')

  if (!loadTrace) return null

  const length = loadTrace.y.length

  // compute residual load
  const residual: number[] = []

  for (let i = 0; i < length; i++) {
    const load = loadTrace.y[i]

    const totalGeneration = generationTraces.reduce(
      (sum, t) => sum + (t.y[i] ?? 0),
      0
    )

    residual.push(load - totalGeneration)
  }

  // sort descending (duration curve)
  const sorted = [...residual].sort((a, b) => b - a)
  
  // x = hours
  const x = sorted.map((_, i) => i)
  return {
    x,
    y: sorted,
  }
})

// --- COMPUTED: total generation / load ---
const summedData = computed(() => {
  if (!modifiedData.value) return null

  const sumTWh = (trace: Trace) =>
    trace.y.reduce((s, v) => s + v / 1000, 0)

  // --- LOAD BREAKDOWN ---
  const loadEntries = []

  // base load
  const load = modifiedData.value['load']
  if (load) {
    loadEntries.push({
      name: 'load',
      total: sumTWh(load),
    })
  }

  // battery charging → treated as load
  const batteryCharge = batteryTraces.value?.charge
  if (batteryCharge) {
    loadEntries.push({
      name: 'battery_charge',
      total: sumTWh(batteryCharge),
    })
  }

  // Electrolyzers 
  const electrolyzerPower = hydrogenTraces.value?.electrolyzer_power
  if (electrolyzerPower) {
    loadEntries.push({
      name: 'electrolyzer_power',
      total: sumTWh(electrolyzerPower),
    })
  }

  // --- GENERATION BREAKDOWN ---
  const generation = Object.entries(modifiedData.value)
    .filter(([_, trace]) => trace.type === 'generation')
    .map(([name, trace]) => ({
      name,
      total: sumTWh(trace),
    }))

  // battery discharge → treated as generation
  const batteryDischarge = batteryTraces.value?.discharge
  if (batteryDischarge) {
    generation.push({
      name: 'battery_discharge',
      total: sumTWh(batteryDischarge),
    })
  }

  // gas power → treated as generation
  const gasPower = hydrogenTraces.value?.gas_power
  if (gasPower) {
    generation.push({
      name: 'gas_power',
      total: sumTWh(gasPower),
    })
  }

  const totalGeneration = generation.reduce((s, g) => s + g.total, 0)
  const baseLoadTotal = load ? sumTWh(load) : 0
  const renewableShare =
    baseLoadTotal > 0 ? totalGeneration / baseLoadTotal : null

  const timestamps = modifiedData.value.load?.y.length ?? 0

  let overshootMWh = 0
  let loadGapMWh = 0

  for (let i = 0; i < timestamps; i++) {
    // --- generation at timestep i ---
    let gen = 0

    // normal generation
    for (const trace of Object.values(modifiedData.value)) {
      if (trace.type === 'generation') {
        gen += trace.y[i]
      }
    }

    // battery discharge
    if (batteryTraces.value?.discharge) {
      gen += batteryTraces.value.discharge.y[i]
    }

    // gas power
    if (hydrogenTraces.value?.gas_power) {
      gen += hydrogenTraces.value.gas_power.y[i]
    }

    // --- load at timestep i ---
    let loadTotal = 0

    if (load) loadTotal += load.y[i]

    if (batteryTraces.value?.charge) {
      loadTotal += batteryTraces.value.charge.y[i]
    }

    if (hydrogenTraces.value?.electrolyzer_power) {
      loadTotal += hydrogenTraces.value.electrolyzer_power.y[i]
    }

    // --- balance ---
    const diff = gen - loadTotal

    if (diff > 0) {
      overshootMWh += diff
    } else {
      loadGapMWh += -diff
    }
  }

  const overshootTWh = overshootMWh / 1000
  const loadGapTWh = loadGapMWh / 1000

  return {
    loadEntries,
    generation,
    renewableShare,
    overshootTWh,
    loadGapTWh
  }
})



// Computed battery traces 
const batteryTraces = computed(() => {
  if (!modifiedData.value) return null

  const traces = Object.values(modifiedData.value)

  const loadTrace = traces.find(t => t.type === 'load')
  const generationTraces = traces.filter(t => t.type === 'generation')

  if (!loadTrace) return null

  const length = loadTrace.y.length

  const storage: number[] = []
  const charge: number[] = []
  const discharge: number[] = []

  let soc = 0 // state of charge

  for (let i = 0; i < length; i++) {
    const load = loadTrace.y[i]

    const totalGeneration = generationTraces.reduce(
      (sum, t) => sum + (t.y[i] ?? 0),
      0
    )

    const residual = load - totalGeneration

    let chargePower = 0
    let dischargePower = 0

    if (residual < 0) {
      // excess → charge
      const available = -residual

      chargePower = Math.min(
        available,
        batteryData.value["power"],
        batteryData.value["capacity"]-soc
      )

      soc += chargePower
    } else if (residual > 0) {
      // deficit → discharge
      const needed = residual

      dischargePower = Math.min(
        needed,
        batteryData.value["power"],
        soc
      )

      soc -= dischargePower
    }

    storage.push(soc)
    charge.push(chargePower)
    discharge.push(dischargePower)
  }

  return {
    storage: { y: storage, type: "battery_storage" },
    charge: { y: charge, type: "battery_charge" },
    discharge: { y: discharge, type: "battery_discharge"},
  }
})


// Computed hydrogen traces 
const hydrogenTraces = computed(() => {
  if (!batteryTraces.value || !modifiedData.value) return null

  const traces = Object.values(modifiedData.value)

  const loadTrace = traces.find(t => t.type === 'load')
  const generationTraces = traces.filter(t => t.type === 'generation')

  if (!loadTrace) return null

  const length = loadTrace.y.length

  const hydrogen_storage: number[] = []
  const electrolyzer_power: number[] = []
  const gas_power: number[] = []

  let soc = hydrogenData.value["storage_capacity"] * 1000 * 0.5 // state of charge

  for (let i = 0; i < length; i++) {
    const load = loadTrace.y[i]

    const totalGeneration = generationTraces.reduce(
      (sum, t) => sum + (t.y[i] ?? 0),
      0
    )

    const battery_charge_power = batteryTraces.value.charge.y[i]
    const battery_discharge_power = batteryTraces.value.discharge.y[i]
    const residual = load - totalGeneration

    let electrolyzerPower = 0
    let gasPower = 0

    if (residual < 0) {
      const available = -residual - battery_charge_power

      electrolyzerPower = Math.min(
        available,
        hydrogenData.value["electrolyser_power"],
        (hydrogenData.value["storage_capacity"]*1000-soc)/0.7
      )

      soc += electrolyzerPower*0.7

    } else if (residual > 0) {
      const needed = residual- battery_discharge_power

      gasPower = Math.min(
        needed,
        hydrogenData.value["gas_power"],
        soc*0.5
      )

      soc -= gasPower/0.5
    }

    hydrogen_storage.push(soc)
    electrolyzer_power.push(electrolyzerPower)
    gas_power.push(gasPower)
  }

  return {
    hydrogen_storage: { y: hydrogen_storage, type: "hydrogen_storage" },
    electrolyzer_power: { y: electrolyzer_power, type: "elctrolyzer_power"},
    gas_power: { y: gas_power, type: "generation"},
  }
})


const residualWithStorages = computed(() => {
  if (!batteryTraces.value || !modifiedData.value || !hydrogenTraces.value) return null

  const traces = Object.values(modifiedData.value)
  const loadTrace = traces.find(t => t.type === 'load')
  const generationTraces = traces.filter(t => t.type === 'generation')

  if (!loadTrace) return null

  const length = loadTrace.y.length
  const residual: number[] = []

  for (let i = 0; i < length; i++) {
    const load = loadTrace.y[i]

    const generation = generationTraces.reduce(
      (sum, t) => sum + (t.y[i] ?? 0),
      0
    )

    const charge = batteryTraces.value.charge.y[i]
    const discharge = batteryTraces.value.discharge.y[i]
    const electrolyzer_power = hydrogenTraces.value.electrolyzer_power.y[i]
    const gas_power = hydrogenTraces.value.gas_power.y[i]

    residual.push(load - generation + charge - discharge + electrolyzer_power - gas_power)
    }

    // sort descending (duration curve)
    const sorted = [...residual].sort((a, b) => b - a)
    
    // x = hours
    const x = sorted.map((_, i) => i)
    return {
      x,
      y: sorted,
  }
  })

const combinedTimeSeriesData = computed(() => {
  if (!modifiedData.value || !batteryTraces.value || !hydrogenTraces.value) return null

  return {
    ...modifiedData.value,

    battery_charge: {
      y: batteryTraces.value.charge.y,
      type: 'battery_charge',
    },

    battery_discharge: {
      y: batteryTraces.value.discharge.y,
      type: 'battery_discharge',
    },

    electrolyzer_power: {
      y: hydrogenTraces.value.electrolyzer_power.y,
      type: "electrolyzer_power",
    },

    gas_power: {
      y: hydrogenTraces.value.gas_power.y,
      type: "generation",
    },
  }
})

const combinedResiduals = computed(() => {
  if (!residualLoadCurve.value || !residualWithStorages.value) return null

  return {
    residual_base: {
      x: residualLoadCurve.value.x,
      y: residualLoadCurve.value.y,
    },

    residual_storages: {
      x: residualWithStorages.value.x,
      y: residualWithStorages.value.y,
    },
  }
})

const storageCharges = computed(() => {
  if (!batteryTraces.value || !baseData.value || !hydrogenTraces.value) return null

  return {
    battery: {
      y: batteryTraces.value.storage.y,
    },
    reservoir_storage: {
      y: baseData.value.hydro_storage.y,
    },
    hydrogen_storage: {
      y: hydrogenTraces.value.hydrogen_storage.y,
    }
  }
})


export function useModel() {
  return {
    // state
    powers,
    load,
    useBatteries,
    batteryData,
    useHydrogen,
    hydrogenData,

    // actions
    loadTimeSeries,
    loadPowersData,
    setPowerScenario,
    loadLoadData,
    setLoadScenario,

    // (computed) results
    summedData,
    storageCharges,
    combinedResiduals,
    combinedTimeSeriesData,
    
  }
}
