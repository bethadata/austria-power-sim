<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import UnitTextField from '@/components/model/UnitTextField.vue'
import HelpIcon from '@/components/ui/HelpIcon.vue'
import PanelCard from '@/components/ui/PanelCard.vue'
import { useModel } from '@/composables/useModel'

const { t } = useI18n({ useScope: 'global' })

const { load, loadLoadData, setLoadScenario, loadPowersData, setPowerScenario, loadTimeSeries } =
  useModel()

/*
 * The scenario picker and the profile picker were two separate cards. They are
 * one panel now because they answer the same question -- which year or pathway
 * is being simulated -- and splitting them put two card headers into the
 * control rail for three fields.
 */
type SystemKey = '2023' | '2024' | 'TYNDP_2024_NT_2030' | 'TYNDP_2024_NT_2040'

// Short enough to read in full inside the control rail. The long forms
// ("Actual 2023 (E-Control)", "TYNDP2024 2030") were truncated to an ellipsis at
// every width below about 1600px, which hid the part that differs.
const SYSTEM_SCENARIOS: { title: string; value: SystemKey }[] = [
  { title: '2023 (E-Control)', value: '2023' },
  { title: '2024 (E-Control)', value: '2024' },
  { title: 'TYNDP 2030 (NT)', value: 'TYNDP_2024_NT_2030' },
  { title: 'TYNDP 2040 (NT)', value: 'TYNDP_2024_NT_2040' },
]

const SYSTEM_SOURCES: Record<SystemKey, { load: string; powers: string }> = {
  '2023': { load: 'load_2023', powers: 'powers_installed_2023' },
  '2024': { load: 'load_2024', powers: 'powers_installed_2024' },
  TYNDP_2024_NT_2030: { load: 'load_TYNDP_2024_NT_2030', powers: 'TYNDP_2024_NT_2030' },
  TYNDP_2024_NT_2040: { load: 'load_TYNDP_2024_NT_2040', powers: 'TYNDP_2024_NT_2040' },
}

const TIMESERIES = [
  { title: '2024 (ENTSO-E)', value: 'timeseries_2024' },
  { title: '2023 (ENTSO-E)', value: 'timeseries_2023' },
]

const selectedSystem = ref<SystemKey>('2024')
const selectedTimeSeries = ref(TIMESERIES[0].value)

let loaded = false

async function applySystem() {
  const source = SYSTEM_SOURCES[selectedSystem.value]
  if (!source) return

  if (!loaded) {
    await loadLoadData()
    await loadPowersData()
    loaded = true
  }

  setPowerScenario(source.powers)
  setLoadScenario(source.load)
}

async function applyTimeSeries() {
  await loadTimeSeries(selectedTimeSeries.value)
}

onMounted(async () => {
  await applySystem()
  await applyTimeSeries()
})
</script>

<template>
  <PanelCard :title="t('loaddata_form.title')" :tooltip="t('loaddata_form.tooltip')">
    <v-select
      v-model="selectedSystem"
      :label="t('loaddata_form.load_scenario')"
      :items="SYSTEM_SCENARIOS"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="compact"
      hide-details
      class="mb-3"
      @update:model-value="applySystem"
    />

    <UnitTextField
      v-model="load"
      :label="t('loaddata_form.load_label')"
      :tooltip="t('loaddata_form.load_label_tooltip')"
      unit="TWh"
      class="mb-3"
    />

    <v-select
      v-model="selectedTimeSeries"
      :label="t('timeseries_form.timeseries_scenario')"
      :items="TIMESERIES"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="compact"
      hide-details
      @update:model-value="applyTimeSeries"
    >
      <template #append-inner>
        <HelpIcon :text="t('timeseries_form.tooltip')" />
      </template>
    </v-select>
  </PanelCard>
</template>
