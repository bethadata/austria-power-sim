<template>
  <v-container>
    <v-row justify="center">
    <v-col cols="12" md="9" lg="7">

    <!-- GENERAL -->
    <v-card class="ps-4 mb-4" elevation="2">
      <v-card-title>{{ t('models_page.general.title') }}</v-card-title>
      <v-card-text>
        <p>{{ t('models_page.general.p1') }}</p>
        <p>{{ t('models_page.general.p2') }}</p>

        <i18n-t keypath="models_page.general.p3" tag="p">
         <template #link>
            <a href="https://www.e-control.at/statistik/e-statistik/archiv/betriebsstatistik/jahresreihen" target="_blank" rel="noopener noreferrer">
              {{ t('models_page.general.link') }}
            </a>
          </template>
        </i18n-t>
        
        <v-alert type="info" variant="tonal" class="mb-6">
          {{ t('models_page.general.alert') }}
        </v-alert>

        <p>{{ t('models_page.general.p4') }}</p>

      </v-card-text>
    </v-card>

    <!-- STORAGE -->
    <v-card class="ps-4 mb-4" elevation="2">
      <v-card-title>{{ t('models_page.storage.title') }}</v-card-title>
      <v-card-text>

        <p>{{ t('models_page.storage.p1') }}</p>

        <p><b>{{ t('models_page.storage.reservoir_title') }}</b></p>
        <ul class="compact-list">
          <li v-for="item in tm('models_page.storage.reservoir_points')" :key="item">
            {{ item }}
          </li>
        </ul>

        <p><b>{{ t('models_page.storage.battery_title') }}</b></p>
        <ul class="compact-list">
          <li v-for="item in tm('models_page.storage.battery_points')" :key="item">
            {{ item }}
          </li>
        </ul>

        <p><b>{{ t('models_page.storage.hydrogen_title') }}</b></p>
        <ul class="compact-list">
          <li v-for="item in tm('models_page.storage.hydrogen_points')" :key="item">
            {{ item }}
          </li>
        </ul>

        <v-alert type="warning" variant="tonal" class="mb-4">
          {{ t('models_page.storage.alert') }}
        </v-alert>

      </v-card-text>
    </v-card>

    <!-- SCENARIOS -->
    <v-card class="ps-4 mb-4" elevation="2">
      <v-card-title>{{ t('models_page.scenarios.title') }}</v-card-title>
      <v-card-text>
      <p>{{ t('models_page.scenarios.text_options') }}</p>
        <ul class="compact-list">
          <li>
            <i18n-t keypath="models_page.scenarios.options.0" tag="span">
              <template #link3>
                <a href="https://www.e-control.at/statistik/e-statistik/archiv/bestandsstatistik" target="_blank" rel="noopener noreferrer">
                  {{ t('models_page.scenarios.link3') }}
                </a>
              </template>
            </i18n-t>
          </li>
          <li>{{ t('models_page.scenarios.options.1') }}</li>
        </ul>

        <i18n-t keypath="models_page.scenarios.text" tag="p">
          <template #link1>
            <a href="https://2024.entsos-tyndp-scenarios.eu/download/" target="_blank" rel="noopener noreferrer">
              {{ t('models_page.scenarios.link1') }}
            </a>
          </template>

          <template #link2>
            <a href="https://transparency.entsoe.eu/" target="_blank" rel="noopener noreferrer">
              {{ t('models_page.scenarios.link2') }}
            </a>
          </template>

        </i18n-t>

        <v-alert type="info" variant="tonal" class="mb-6">
          {{ t('models_page.scenarios.alert') }}
        </v-alert>

      </v-card-text>
    </v-card>

    <!-- LIMITATIONS -->
    <v-card class="ps-4 mb-2" elevation="2">
      <v-card-title>{{ t('models_page.limitations.title') }}</v-card-title>
      <v-card-text>

        <p>{{ t('models_page.limitations.intro') }}</p>
        <p>{{ t('models_page.limitations.subtitle') }}</p>

        <ul class="compact-list">
          <li v-for="item in tm('models_page.limitations.items')" :key="item">
            {{ item }}
          </li>
        </ul>

      </v-card-text>
    </v-card>

    </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
</script>