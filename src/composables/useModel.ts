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

// scaleMap - match Timeseries keys to Powers keys
const scaleMap: Record<string, string> = {
  "solar": "solar",
  "wind_onshore": "wind_onshore",
  "hydro_river": "hydro_river",
  "hydro_reservoir": "hydro_reservoir",
  "hydro_pumped_reservoir": "hydro_pumped_reservoir",
  "biomass": "biomass",
  "waste": "waste"
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

// --- COMPUTED: single-pass storage simulation + residuals + overshoot ---
const storageAndResiduals = computed(() => {
  if (!modifiedData.value) return null

  const traces = Object.values(modifiedData.value)
  const loadTrace = traces.find(t => t.type === 'load')
  const generationTraces = traces.filter(t => t.type === 'generation')

  if (!loadTrace) return null

  const withBattery = useBatteries.value
  const withHydrogen = useHydrogen.value

  // Read storage params only when the respective storage is enabled.
  // Vue only tracks reactive deps that are actually accessed, so batteryData
  // and hydrogenData are not tracked — and won't trigger recomputation — when
  // their flags are false.
  const battCapacity = withBattery ? batteryData.value["capacity"] : 0
  const battPower    = withBattery ? batteryData.value["power"] : 0

  const h2Capacity        = withHydrogen ? hydrogenData.value["storage_capacity"] * 1000 : 0
  const h2ElectrolyserPow = withHydrogen ? hydrogenData.value["electrolyser_power"] : 0
  const h2GasPow          = withHydrogen ? hydrogenData.value["gas_power"] : 0

  const length = loadTrace.y.length

  const battery_storage   = new Array<number>(length)
  const battery_charge    = new Array<number>(length)
  const battery_discharge = new Array<number>(length)
  const hydrogen_storage  = new Array<number>(length)
  const electrolyzer_power = new Array<number>(length)
  const gas_power         = new Array<number>(length)
  const residual_base     = new Array<number>(length)
  const residual_net      = new Array<number>(length)

  let batterySoc  = 0
  let hydrogenSoc = withHydrogen ? h2Capacity * 0.5 : 0

  let overshootMWh = 0
  let loadGapMWh   = 0

  for (let i = 0; i < length; i++) {
    const loadVal = loadTrace.y[i]

    let gen = 0
    for (const t of generationTraces) gen += t.y[i] ?? 0

    const baseResidual = loadVal - gen
    residual_base[i] = baseResidual

    let chargePow    = 0
    let dischargePow = 0
    let electPow     = 0
    let gasPowVal    = 0

    if (withBattery) {
      if (baseResidual < 0) {
        chargePow = Math.min(-baseResidual, battPower, battCapacity - batterySoc)
        batterySoc += chargePow
      } else if (baseResidual > 0) {
        dischargePow = Math.min(baseResidual, battPower, batterySoc)
        batterySoc -= dischargePow
      }
    }

    if (withHydrogen) {
      const afterBattery = baseResidual + chargePow - dischargePow
      if (afterBattery < 0) {
        electPow = Math.min(-afterBattery, h2ElectrolyserPow, (h2Capacity - hydrogenSoc) / 0.7)
        hydrogenSoc += electPow * 0.7
      } else if (afterBattery > 0) {
        gasPowVal = Math.min(afterBattery, h2GasPow, hydrogenSoc * 0.5)
        hydrogenSoc -= gasPowVal / 0.5
      }
    }

    battery_storage[i]    = batterySoc
    battery_charge[i]     = chargePow
    battery_discharge[i]  = dischargePow
    hydrogen_storage[i]   = hydrogenSoc
    electrolyzer_power[i] = electPow
    gas_power[i]          = gasPowVal

    const netResidual = baseResidual + chargePow - dischargePow + electPow - gasPowVal
    residual_net[i] = netResidual

    if (netResidual > 0) loadGapMWh   += netResidual
    else                 overshootMWh += -netResidual
  }

  const sortDesc = (arr: number[]) => [...arr].sort((a, b) => b - a)
  const hours = Array.from({ length }, (_, i) => i)

  const sorted_base = sortDesc(residual_base)
  const sorted_net  = sortDesc(residual_net)

  return {
    battery: {
      storage:  { y: battery_storage,   type: "battery_storage" },
      charge:   { y: battery_charge,    type: "battery_charge" },
      discharge:{ y: battery_discharge, type: "battery_discharge" },
    },
    hydrogen: {
      hydrogen_storage: { y: hydrogen_storage,   type: "hydrogen_storage" },
      electrolyzer_power: { y: electrolyzer_power, type: "electrolyzer_power" },
      gas_power:          { y: gas_power,          type: "generation" },
    },
    residuals: {
      base:        { x: hours, y: sorted_base },
      with_storage:{ x: hours, y: sorted_net },
    },
    overshootTWh: overshootMWh / 1000,
    loadGapTWh:   loadGapMWh   / 1000,
  }
})

// --- COMPUTED: total generation / load ---
const summedData = computed(() => {
  if (!modifiedData.value || !storageAndResiduals.value) return null

  const sar = storageAndResiduals.value
  const sumTWh = (y: number[]) => y.reduce((s, v) => s + v / 1000, 0)

  // --- LOAD BREAKDOWN ---
  const loadEntries = []

  const load = modifiedData.value['load']
  if (load) loadEntries.push({ name: 'load', total: sumTWh(load.y) })

  if (useBatteries.value) {
    loadEntries.push({ name: 'battery_charge',    total: sumTWh(sar.battery.charge.y) })
  }
  if (useHydrogen.value) {
    loadEntries.push({ name: 'electrolyzer_power', total: sumTWh(sar.hydrogen.electrolyzer_power.y) })
  }

  // --- GENERATION BREAKDOWN ---
  const generation = Object.entries(modifiedData.value)
    .filter(([_, trace]) => trace.type === 'generation')
    .map(([name, trace]) => ({ name, total: sumTWh(trace.y) }))

  if (useBatteries.value) {
    generation.push({ name: 'battery_discharge', total: sumTWh(sar.battery.discharge.y) })
  }
  if (useHydrogen.value) {
    generation.push({ name: 'gas_power', total: sumTWh(sar.hydrogen.gas_power.y) })
  }

  const renewableGeneration = generation
    .filter(g => g.name !== 'waste')
    .reduce((s, g) => s + g.total, 0)
  const baseLoadTotal  = load ? sumTWh(load.y) : 0
  const renewableShare = baseLoadTotal > 0 ? renewableGeneration / baseLoadTotal : null

  return {
    loadEntries,
    generation,
    renewableShare,
    overshootTWh: sar.overshootTWh,
    loadGapTWh:   sar.loadGapTWh,
  }
})

const combinedTimeSeriesData = computed(() => {
  if (!modifiedData.value || !storageAndResiduals.value) return null

  const sar = storageAndResiduals.value
  const result: TraceSet = { ...modifiedData.value }

  if (useBatteries.value) {
    result.battery_charge    = { y: sar.battery.charge.y,    type: 'battery_charge' }
    result.battery_discharge = { y: sar.battery.discharge.y, type: 'battery_discharge' }
  }
  if (useHydrogen.value) {
    result.electrolyzer_power = { y: sar.hydrogen.electrolyzer_power.y, type: 'electrolyzer_power' }
    result.gas_power          = { y: sar.hydrogen.gas_power.y,          type: 'generation' }
  }

  return result
})

const combinedResiduals = computed(() => {
  if (!storageAndResiduals.value) return null

  return {
    residual_base:    storageAndResiduals.value.residuals.base,
    residual_storages: storageAndResiduals.value.residuals.with_storage,
  }
})

const storageCharges = computed(() => {
  if (!storageAndResiduals.value || !baseData.value) return null

  return {
    battery:           { y: storageAndResiduals.value.battery.storage.y },
    reservoir_storage: { y: baseData.value.hydro_storage.y },
    hydrogen_storage:  { y: storageAndResiduals.value.hydrogen.hydrogen_storage.y },
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
