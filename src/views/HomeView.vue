<script setup lang="ts">
import BarResults from '@/components/model/BarResults.vue'
import KpiTiles from '@/components/model/KpiTiles.vue'
import ResidualLoadPlot from '@/components/model/ResidualLoadPlot.vue'
import ResultsPlot from '@/components/model/ResultsPlot.vue'
import ScenarioForm from '@/components/model/ScenarioForm.vue'
import StoragesPlot from '@/components/model/StoragesPlot.vue'
import SystemDataForm from '@/components/model/SystemDataForm.vue'
import BottomInfo from '@/components/sections/BottomInfo.vue'
import IntroCard from '@/components/sections/IntroCard.vue'
import { useModel } from '@/composables/useModel'

const { summedData, storageCharges, combinedResiduals, combinedTimeSeriesData } = useModel()
</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">
    <IntroCard class="mb-4" />

    <v-row>
      <!--
        Controls left, results right. The rail is a quarter of the page and
        sticks to the top of the viewport on desktop, so a capacity can be
        changed while looking at the chart it moves -- the previous layout put
        the inputs in a 2/12 column that scrolled away after the first chart.
        Below lg the rail becomes the first block of a single column, which is
        the reading order the page wants anyway: set the scenario, then look.
      -->
      <v-col cols="12" lg="3">
        <div class="control-rail d-flex flex-column ga-4">
          <ScenarioForm />
          <SystemDataForm />
        </div>
      </v-col>

      <v-col cols="12" lg="9">
        <v-row>
          <v-col cols="12">
            <h2 class="d-sr-only">{{ $t('system_results.section') }}</h2>
            <KpiTiles />
          </v-col>

          <v-col cols="12">
            <ResultsPlot
              v-if="combinedTimeSeriesData"
              :data="combinedTimeSeriesData"
              :height="360"
            />
          </v-col>

          <!-- The energy balance is two categorical bars and reads fine narrow;
               the storage fill levels are an 8 760-point time series and do not,
               so the width goes there. -->
          <v-col cols="12" md="5">
            <BarResults v-if="summedData" :data="summedData" :height="280" />
          </v-col>

          <v-col cols="12" md="7">
            <StoragesPlot v-if="storageCharges" :data="storageCharges" :height="280" />
          </v-col>

          <v-col cols="12">
            <ResidualLoadPlot v-if="combinedResiduals" :data="combinedResiduals" :height="280" />
          </v-col>

          <v-col cols="12">
            <BottomInfo />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/*
 * Only from lg up, which is where the two-column layout exists at all. The rail
 * carries its own scrollbar rather than being clipped: with both storages
 * switched on it is taller than a laptop viewport, and a sticky element taller
 * than the viewport otherwise pins its top and hides its last fields for good.
 */
/*
 * The rail is a flex column, so its cards would otherwise shrink to fit the
 * max-height below rather than overflow it -- and a v-card clips its own
 * content, so the squashed cards silently lost their header and their last
 * field instead of producing a scrollbar.
 */
.control-rail > * {
  flex: 0 0 auto;
}

@media (min-width: 1280px) {
  .control-rail {
    position: sticky;
    /* app bar (64px) + the container's md padding */
    top: 88px;
    max-height: calc(100vh - 112px);
    overflow-y: auto;
    scrollbar-width: thin;
    /* Room for the scrollbar so the card borders do not sit under it. */
    padding-right: 4px;
  }
}
</style>
