<template>
  <v-container fluid>

    <IntroCard class="mb-6" />

    <v-row>
      <v-col cols="12" md="2" class="d-flex">
        <ModelForm/>      
      </v-col>

      <v-col cols="12" md="10">
        <v-row class="d-flex">
        <v-col cols="12" md="6">
          <BoundaryDataForm/> 
        </v-col>
        <v-col cols="12" md="6">
          <TimeSeriesForm/>
        </v-col>
          
        </v-row>
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="pa-2">
                <ResultsPlot
                v-if="combinedTimeSeriesData"
                :data="combinedTimeSeriesData"
                />
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <v-card class="pa-2">
                <BarResults
                v-if="summedData"
                :data="summedData"
                />
                </v-card>
            </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-2">
              <StoragesPlot
              v-if="storageCharges"
              :data="storageCharges"
              />
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-2">
            <ResidualLoadPlot
            v-if="combinedResiduals"
            :data="combinedResiduals"
            />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <BottomInfo class="mt-6" />
  </v-container>
</template>

<script setup lang="ts">
import IntroCard from '../components/sections/IntroCard.vue'
import BottomInfo from '../components/sections/BottomInfo.vue'
import ModelForm from '../components/model/SystemDataForm.vue'
import BoundaryDataForm from '../components/model/LoadDataForm.vue'
import ResultsPlot from '../components/model/ResultsPlot.vue'
import BarResults from '../components/model/BarResults.vue'
import ResidualLoadPlot from '../components/model/ResidualLoadPlot.vue'
import StoragesPlot from '../components/model/StoragesPlot.vue'
import { useModel } from '../composables/useModel'
import TimeSeriesForm from '../components/model/TimeSeriesForm.vue'

const { summedData, storageCharges, combinedResiduals, combinedTimeSeriesData } = useModel()

</script>