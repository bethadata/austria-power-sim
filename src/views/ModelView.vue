<!--
  Laid out on the About page's skeleton (2026-08-30): a full-width lead card,
  then the site-specific content cards, then the shorter cards of equal standing
  as a row. Nothing is centred in a reading column -- the page used to sit in an
  md-10/lg-8/xl-7 column, which made it and About the only routes that did not
  use the width the charts do.

  The three storage types are parallel, equally short and were three stacked
  half-empty bands at full width, so they sit side by side inside their card.
-->
<template>
  <v-container fluid class="model-page pa-4 pa-md-6">
    <h1 class="text-headline-small mb-4">{{ t('header.model') }}</h1>

    <!-- GENERAL -->
    <v-card flat border class="mb-4">
      <v-card-title tag="h2" class="text-title-medium pt-4">
        {{ t('models_page.general.title') }}
      </v-card-title>

      <v-card-text class="prose text-body-medium">
        <p>{{ t('models_page.general.p1') }}</p>
        <p>{{ t('models_page.general.p2') }}</p>

        <i18n-t keypath="models_page.general.p3" tag="p" scope="global">
          <template #link>
            <a
              href="https://www.e-control.at/statistik/e-statistik/archiv/betriebsstatistik/jahresreihen"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('models_page.general.link') }}
            </a>
          </template>
        </i18n-t>

        <p>{{ t('models_page.general.p4') }}</p>

        <v-alert type="info" variant="tonal" class="mt-4">
          {{ t('models_page.general.alert') }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- STORAGE -->
    <v-card flat border class="mb-4">
      <v-card-title tag="h2" class="text-title-medium pt-4">
        {{ t('models_page.storage.title') }}
      </v-card-title>

      <v-card-text class="prose text-body-medium">
        <p>{{ t('models_page.storage.p1') }}</p>

        <v-row>
          <v-col cols="12" md="4">
            <h3 class="text-title-small mb-2">{{ t('models_page.storage.reservoir_title') }}</h3>
            <ul class="compact-list">
              <li v-for="item in tm('models_page.storage.reservoir_points')" :key="item">
                {{ item }}
              </li>
            </ul>
          </v-col>

          <v-col cols="12" md="4">
            <h3 class="text-title-small mb-2">{{ t('models_page.storage.battery_title') }}</h3>
            <ul class="compact-list">
              <li v-for="item in tm('models_page.storage.battery_points')" :key="item">
                {{ item }}
              </li>
            </ul>
          </v-col>

          <v-col cols="12" md="4">
            <h3 class="text-title-small mb-2">{{ t('models_page.storage.hydrogen_title') }}</h3>
            <ul class="compact-list">
              <li v-for="item in tm('models_page.storage.hydrogen_points')" :key="item">
                {{ item }}
              </li>
            </ul>
          </v-col>
        </v-row>

        <v-alert type="warning" variant="tonal">
          {{ t('models_page.storage.alert') }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!--
      Scenarios and limitations are of comparable length and equal standing, so
      they sit side by side rather than as two more full-width bands. `h-100` is
      what makes the two cards in a row end at the same edge.
    -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card flat border class="h-100">
          <v-card-title tag="h2" class="text-title-medium pt-4">
            {{ t('models_page.scenarios.title') }}
          </v-card-title>

          <v-card-text class="prose text-body-medium">
            <p>{{ t('models_page.scenarios.text_options') }}</p>

            <ul class="compact-list">
              <li>
                <i18n-t keypath="models_page.scenarios.options.0" tag="span" scope="global">
                  <template #link3>
                    <a
                      href="https://www.e-control.at/statistik/e-statistik/archiv/bestandsstatistik"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ t('models_page.scenarios.link3') }}
                    </a>
                  </template>
                </i18n-t>
              </li>
              <li>{{ t('models_page.scenarios.options.1') }}</li>
            </ul>

            <i18n-t keypath="models_page.scenarios.text" tag="p" scope="global">
              <template #link1>
                <a
                  href="https://2024.entsos-tyndp-scenarios.eu/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('models_page.scenarios.link1') }}
                </a>
              </template>

              <template #link2>
                <a href="https://transparency.entsoe.eu/" target="_blank" rel="noopener noreferrer">
                  {{ t('models_page.scenarios.link2') }}
                </a>
              </template>

              <template #link_energycharts>
                <a href="https://www.energy-charts.info" target="_blank" rel="noopener noreferrer">
                  {{ t('models_page.scenarios.link_energycharts') }}
                </a>
              </template>
            </i18n-t>

            <v-alert type="info" variant="tonal" class="mt-4">
              {{ t('models_page.scenarios.alert') }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card flat border class="h-100">
          <v-card-title tag="h2" class="text-title-medium pt-4">
            {{ t('models_page.limitations.title') }}
          </v-card-title>

          <v-card-text class="prose text-body-medium">
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

const { t, tm } = useI18n({ useScope: 'global' })
</script>
