<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import UnitTextField from '@/components/model/UnitTextField.vue'
import PanelCard from '@/components/ui/PanelCard.vue'
import { useModel } from '@/composables/useModel'

const { t } = useI18n({ useScope: 'global' })
const { powers, batteryData, useBatteries, useHydrogen, hydrogenData } = useModel()

// Label/tooltip key stems, in display order. A list rather than eleven
// near-identical blocks of markup -- the keys are all `<stem>_label` and
// `<stem>_tooltip`, so anything else is transcription.
const CAPACITIES = [
  'solar_power',
  'wind_onshore_power',
  'hydro_river_power',
  'hydro_reservoir_power',
  'hydro_pumped_reservoir_power',
] as const

const POWER_KEYS: Record<(typeof CAPACITIES)[number], string> = {
  solar_power: 'solar',
  wind_onshore_power: 'wind_onshore',
  hydro_river_power: 'hydro_river',
  hydro_reservoir_power: 'hydro_reservoir',
  hydro_pumped_reservoir_power: 'hydro_pumped_reservoir',
}
</script>

<template>
  <PanelCard :title="t('system_data_form.title')" :tooltip="t('system_data_form.tooltip')">
    <div class="d-flex flex-column ga-3">
      <UnitTextField
        v-for="key in CAPACITIES"
        :key="key"
        v-model="powers[POWER_KEYS[key]]"
        :label="t(`system_data_form.${key}_label`)"
        :tooltip="t(`system_data_form.${key}_tooltip`)"
        unit="GW"
      />
    </div>

    <v-divider class="my-4" />

    <!--
      The storage inputs are mounted only while their storage is on, rather than
      rendered disabled. Eleven always-visible fields made the control rail
      twice as tall as the viewport, and five of them were inert most of the
      time. The model reads a disabled storage's parameters inside its own
      branch (see useModel.ts), so hiding the fields changes nothing it sees.
    -->
    <v-switch
      v-model="useBatteries"
      :label="t('system_data_form.enable_batteries')"
      color="primary"
      density="compact"
      hide-details
      inset
    />

    <v-expand-transition>
      <div v-show="useBatteries" class="d-flex flex-column ga-3 mt-3">
        <UnitTextField
          v-model="batteryData.capacity"
          :label="t('system_data_form.battery_capacity_label')"
          :tooltip="t('system_data_form.battery_capacity_tooltip')"
          unit="GWh"
        />
        <UnitTextField
          v-model="batteryData.power"
          :label="t('system_data_form.battery_power_label')"
          :tooltip="t('system_data_form.battery_power_tooltip')"
          unit="GW"
        />
      </div>
    </v-expand-transition>

    <v-divider class="my-4" />

    <v-switch
      v-model="useHydrogen"
      :label="t('system_data_form.enable_hydrogen')"
      color="primary"
      density="compact"
      hide-details
      inset
    />

    <v-expand-transition>
      <div v-show="useHydrogen" class="d-flex flex-column ga-3 mt-3">
        <UnitTextField
          v-model="hydrogenData.storage_capacity"
          :label="t('system_data_form.hydrogen_storage_label')"
          :tooltip="t('system_data_form.hydrogen_storage_tooltip')"
          unit="TWh"
        />
        <UnitTextField
          v-model="hydrogenData.electrolyser_power"
          :label="t('system_data_form.electrolyser_power_label')"
          :tooltip="t('system_data_form.electrolyser_power_tooltip')"
          unit="GW"
        />
        <UnitTextField
          v-model="hydrogenData.gas_power"
          :label="t('system_data_form.gas_power_label')"
          :tooltip="t('system_data_form.gas_power_tooltip')"
          unit="GW"
        />
      </div>
    </v-expand-transition>
  </PanelCard>
</template>
