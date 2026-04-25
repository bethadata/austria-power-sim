<template>
  <v-card class="pa-4 flex-grow-1">
      <CardTitleWithTooltip
        :title="t('system_data_form.title')"
        :tooltip="t('system_data_form.tooltip')"
      />

    <UnitTextField
      :label="t('system_data_form.solar_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.solar_power_tooltip')"
      v-model="powers.wind_onshore_power"
    />

    <UnitTextField
      :label="t('system_data_form.wind_onshore_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.wind_onshore_power_tooltip')"
      v-model="powers.wind_onshore_power"
    />

    <UnitTextField
      :label="t('system_data_form.hydro_river_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.hydro_river_power_tooltip')"
      v-model="powers.hydro_river_power"
    />

    <UnitTextField
      :label="t('system_data_form.hydro_reservoir_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.hydro_reservoir_power_tooltip')"
      v-model="powers.hydro_reservoir_power"
    />

    <UnitTextField
      :label="t('system_data_form.hydro_pumped_reservoir_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.hydro_pumped_reservoir_power_tooltip')"
      v-model="powers.hydro_pumped_reservoir_power"
    />

    <v-divider class="mb-4"></v-divider>

    <v-switch
      v-model="useBatteries"
      :label="t('system_data_form.enable_batteries')"
      inset
      class="mb-2"
      :color="useBatteries ? 'primary' : 'grey'"
    />

    <UnitTextField
      :label="t('system_data_form.battery_capacity_label')"
      unit="GWh"
      :tooltip="t('system_data_form.battery_capacity_tooltip')"
      v-model="batteryData.capacity"
      :disabled="!useBatteries"
    />

    <UnitTextField
      :label="t('system_data_form.battery_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.battery_power_tooltip')"
      v-model="batteryData.power"
      :disabled="!useBatteries"
    />

    <v-divider class="mb-4"></v-divider>

    <v-switch
      v-model="useHydrogen"
      :label="t('system_data_form.enable_hydrogen')"
      inset
      class="mb-2"
      :color="useHydrogen ? 'primary' : 'grey'"
    />

    <UnitTextField
      :label="t('system_data_form.hydrogen_storage_label')"
      unit="TWh"
      :tooltip="t('system_data_form.hydrogen_storage_tooltip')"
      v-model="hydrogenData.storage_capacity"
      :disabled="!useHydrogen"
    />

    <UnitTextField
      :label="t('system_data_form.electrolyser_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.electrolyser_power_tooltip')"
      v-model="hydrogenData.electrolyser_power"
      :disabled="!useHydrogen"
    />

    <UnitTextField
      :label="t('system_data_form.gas_power_label')"
      unit="GW"
      :tooltip="t('system_data_form.gas_power_tooltip')"
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

  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const { powers, batteryData, useBatteries, useHydrogen, hydrogenData} = useModel()

</script>

