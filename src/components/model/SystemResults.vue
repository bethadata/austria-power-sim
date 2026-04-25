<template>
    <v-card>
    <v-table density="compact" class="mt-2">
      <tbody>
        <!-- Renewable Share -->
        <tr>
          <td class="kpi-name">
            {{ t('system_results.renewable_share') }}
            <v-tooltip :text="t('system_results.renewable_share_tooltip')">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="14"
                  class="ml-1 text-grey"
                >
                  mdi-help-circle-outline
                </v-icon>
              </template>
            </v-tooltip>
          </td>
          <td class="kpi-value text-green text-right">
            {{ renewableShare }} %
          </td>
        </tr>

        <!-- Overshoot -->
        <tr>
          <td class="kpi-name">
            {{ t('system_results.overshoot_energy') }}
            <v-tooltip :text="t('system_results.overshoot_energy_tooltip')">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="14"
                  class="ml-1 text-grey"
                >
                  mdi-help-circle-outline
                </v-icon>
              </template>
            </v-tooltip>
          </td>
          <td class="kpi-value text-blue text-right">
            {{ overshoot }} TWh
          </td>
        </tr>

        <!-- Load Gap -->
        <tr>
          <td class="kpi-name">
            {{ t('system_results.load_gap') }}
            <v-tooltip :text="t('system_results.load_gap_tooltip')">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="14"
                  class="ml-1 text-grey"
                >
                  mdi-help-circle-outline
                </v-icon>
              </template>
            </v-tooltip>
          </td>
          <td class="kpi-value text-red text-right">
            {{ loadGap }} TWh
          </td>
        </tr>
      </tbody>
    </v-table>
    </v-card>
</template>


<script setup lang="ts">
  import { computed } from 'vue'
  import { useModel } from '../../composables/useModel'

  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const { summedData } = useModel()

  // --- KPI formatting ---
  const renewableShare = computed(() =>
    summedData.value?.renewableShare != null
      ? (summedData.value.renewableShare * 100).toFixed(1)
      : '--'
  )

  const overshoot = computed(() =>
    summedData.value?.overshootTWh != null
      ? summedData.value.overshootTWh.toFixed(1)
      : '--'
  )

  const loadGap = computed(() =>
    summedData.value?.loadGapTWh != null
      ? summedData.value.loadGapTWh.toFixed(1)
      : '--'
  )
</script>

<style scoped>
.kpi-name {
  font-size: 0.85rem;
  color: #555;
  white-space: nowrap;
}

.kpi-value {
  font-size: 1.1rem;
  font-weight: 600;
}
</style>