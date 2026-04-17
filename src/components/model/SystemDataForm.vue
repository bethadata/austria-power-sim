<template>
  <v-card class="pa-4 flex-grow-1">
      <CardTitleWithTooltip
        title="System data"
        tooltip="Values are updated based on chosen scenario, but feel free to build your own scenario!"
      />

    <v-divider class="mb-4"></v-divider>

    <UnitTextField
      label="Solar power"
      unit="GW"
      tooltip="Installed solar power"
      v-model="powers.solar_power"
    />

    <UnitTextField
      label="Wind onshore power"
      unit="GW"
      tooltip="Installed (onshore) wind power"
      v-model="powers.wind_onshore_power"
    />

    <UnitTextField
      label="Hydro river power"
      unit="GW"
      tooltip="Installed hydro river power"
      v-model="powers.hydro_river_power"
    />

    <UnitTextField
      label="Hydro reservoir storage power"
      unit="GW"
      tooltip="Installed hydro reservoir storage power"
      v-model="powers.hydro_reservoir_power"
    />

    <UnitTextField
      label="Hydyro pumped storage power"
      unit="GW"
      tooltip="Installed hydro reservoir storage power"
      v-model="powers.hydro_pumped_reservoir_power"
    />

    <v-divider class="mb-4"></v-divider>

    <v-switch
      v-model="useBatteries"
      label="Enable batteries"
      inset
      class="mb-2"
      :color="useBatteries ? 'primary' : 'grey'"
    />
    <UnitTextField
      label="Battery capacity"
      unit="GWh"
      tooltip="Total battery capacity."
      v-model="batteryData.capacity"
      :disabled="!useBatteries"
    />

    <UnitTextField
      label="Battery power"
      unit="GW"
      tooltip="Total battery power."
      v-model="batteryData.power"
      :disabled="!useBatteries"
    />

    <v-divider class="mb-4"></v-divider>

    <v-switch
      v-model="useHydrogen"
      label="Enable Hydrogen"
      inset
      class="mb-2"
      :color="useHydrogen ? 'primary' : 'grey'"
    />

    <UnitTextField
      label="Hydrogen storage"
      unit="TWh"
      tooltip="Total hydrogen storage in system."
      v-model="hydrogenData.storage_capacity"
      :disabled="!useHydrogen"
    />

    <UnitTextField
      label="Electrolyser power"
      unit="GW"
      tooltip="Total eleltrolyser power."
      v-model="hydrogenData.electrolyser_power"
      :disabled="!useHydrogen"
    />

    <UnitTextField
      label="Gas power"
      unit="GW"
      tooltip="Total gas power plant power."
      v-model="hydrogenData.gas_power"
      :disabled="!useHydrogen"
    />

  </v-card>
</template>

<script setup lang="ts">
  import { useModel } from '../../composables/useModel'
  import '@mdi/font/css/materialdesignicons.css'
  import UnitTextField from './UnitTextField.vue';
  import CardTitleWithTooltip from './CardTitleWithTooltip.vue';

  const { powers, batteryData, useBatteries, useHydrogen, hydrogenData} = useModel()

</script>

