<template>
  <v-card class="pa-4 w-100">
    <CardTitleWithTooltip
        title="Scenario"
        tooltip="Choose between historic powers/loads and selected future TYNDP scenarios."
      />

     <v-row class="d-flex">

      <v-col cols="12" md="6">
      <v-select
        label="System / Load scenario"
        :items="systemScenario"
        item-title="title"
        item-value="value"
        v-model="selectedSystem"
        @update:modelValue="applySystem"
      />
      </v-col>

      <v-col cols="12" md="6">
      <UnitTextField
        label="Total load"
        unit="TWh"
        tooltip="Total load / demand"
        v-model="load"
      />
      </v-col>


    </v-row>
  </v-card>
</template>

<script setup lang="ts">

import { ref, onMounted} from 'vue'
import { useModel } from '../../composables/useModel'
import UnitTextField from './UnitTextField.vue';
import CardTitleWithTooltip from './CardTitleWithTooltip.vue';

const {load, loadLoadData, setLoadScenario, loadPowersData, setPowerScenario} = useModel()

const systemScenario = [
  { title: 'Actual 2025', value: '2025',},
  { title: 'Actual 2024', value: '2024',},
  { title: 'TYNDP2024 2030', value: "TYNDP_2024_NT_2030"},
  { title: 'TYNDP2024 2040', value: "TYNDP_2024_NT_2040"}
]

type SystemKey =
  | '2025'
  | '2024'
  | 'TYNDP_2024_NT_2030'
  | 'TYNDP_2024_NT_2040'

const selectedSystem = ref<SystemKey>('2025')

const loadSystemMap: Record<SystemKey, { load: string; powers: string }> = {
  '2025': {load: 'load_2025', powers: 'powers_installed_2025'},
  '2024': {load: 'load_2024', powers: 'powers_installed_2024'},
  'TYNDP_2024_NT_2030': {load: 'load_TYNDP_2024_NT_2030', powers: 'TYNDP_2024_NT_2040'},
  'TYNDP_2024_NT_2040': {load: 'load_TYNDP_2024_NT_2040', powers: 'TYNDP_2024_NT_2040'}
  }


let loaded = false
async function applySystem() {
  const config = loadSystemMap[selectedSystem.value]

  if (!config) return

  if (!loaded) {
    await loadLoadData()
    await loadPowersData()
    loaded = true
  }

  setPowerScenario(config.powers)
  setLoadScenario(config.load)
}


// auto-load on mount
onMounted(async () => {
  await applySystem()
})

</script>