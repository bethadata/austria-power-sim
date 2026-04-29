<template>
  <v-container>
    <v-row justify="center">
    <v-col cols="12" md="9" lg="7">

    <!-- ABOUT -->
    <v-card class="ps-4 mb-4" elevation="2">
      <v-card-title>{{ t('about_page.about.title') }}</v-card-title>

      <v-card-text>
        <p>{{ t('about_page.about.intro_1') }}</p>
        <p>{{ t('about_page.about.intro_2') }}</p>

        <v-alert type="info" variant="tonal" class="mb-6 mt-6">
          <i18n-t keypath="about_page.about.github_text">
            <template #link>
              <a
                href="https://github.com/bethadata/austria-power-sim"
                target="_blank" rel="noopener noreferrer"
                class="text-primary font-weight-medium"
              >
                {{ t('about_page.about.github_link') }}
              </a>
            </template>
          </i18n-t>
        </v-alert>

        <v-alert type="success" variant="tonal" class="mb-6 mt-6">
          <i18n-t keypath="about_page.about.tracker_text">
            <template #link>
              <a
                href="https://bethadata.github.io/austria-transition-tracker/"
                target="_blank" rel="noopener noreferrer"
                class="text-primary font-weight-medium"
              >
                {{ t('about_page.about.tracker_link') }}
              </a>
            </template>
          </i18n-t>
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- PRIVACY -->
    <v-card class="ps-4 mb-4" elevation="2">
      <v-card-title>{{ t('about_page.privacy.title') }}</v-card-title>

      <v-card-text>
        <i18n-t keypath="about_page.privacy.text" tag="p">
          <template #link1>
            <a
              href="https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection"
              target="_blank" rel="noopener noreferrer"
            >
              {{ t('about_page.privacy.link1') }}
            </a>
          </template>

          <template #link2>
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank" rel="noopener noreferrer"
            >
              {{ t('about_page.privacy.link2') }}
            </a>
          </template>
        </i18n-t>
      </v-card-text>
    </v-card>

    <!-- DISCLAIMER -->
    <v-card class="ps-4 mb-4" elevation="2">
      <v-card-title>{{ t('about_page.disclaimer.title') }}</v-card-title>

      <v-card-text>
        <p>{{ t('about_page.disclaimer.text_1') }}</p>
        <p>{{ t('about_page.disclaimer.text_2') }}</p>
        <p>{{ t('about_page.disclaimer.text_3') }}</p>
      </v-card-text>
    </v-card>

    <!-- AI DISCLAIMER -->
    <v-card class="ps-4 mb-4" elevation="2">
      <v-card-title>{{ t('about_page.ai.title') }}</v-card-title>

      <v-card-text>
        <p>{{ t('about_page.ai.text') }}</p>
      </v-card-text>
    </v-card>

    </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>