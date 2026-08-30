<!--
  The About page of all three sites shares one skeleton: a full-width lead card,
  then the site-specific content cards, then privacy, disclaimer and the AI note
  as a row of three. The page used to sit in a centred md-10/lg-8 column, which
  left the About route as the only page of the site that did not use its width.
-->
<template>
  <v-container fluid class="about-page pa-4 pa-md-6">
    <h1 class="text-headline-small mb-4">{{ t('header.about') }}</h1>

    <!-- ABOUT -->
    <v-card flat border class="mb-4">
      <v-card-title tag="h2" class="text-title-medium pt-4">
        {{ t('about_page.about.title') }}
      </v-card-title>

      <v-card-text class="prose text-body-medium">
        <p>{{ t('about_page.about.intro_1') }}</p>

        <!-- One alert, not two: the repository and the sibling projects are the
             same kind of pointer, and stacking two tonal blocks made the card
             read as mostly callout. -->
        <v-alert type="info" variant="tonal" class="mt-4">
          <i18n-t keypath="about_page.about.links_text" scope="global">
            <template #repo>
              <a
                :href="REPO"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary font-weight-medium"
              >
                {{ t('about_page.about.repo_link') }}
              </a>
            </template>
            <template #transition>
              <a
                :href="TRANSITION_TRACKER"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary font-weight-medium"
              >
                {{ t('about_page.about.transition_link') }}
              </a>
            </template>
            <template #population>
              <a
                :href="POPULATION_TRACKER"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary font-weight-medium"
              >
                {{ t('about_page.about.population_link') }}
              </a>
            </template>
          </i18n-t>
        </v-alert>
      </v-card-text>
    </v-card>

    <!--
      Privacy, disclaimer and the AI note are short and of equal standing, so
      they sit side by side rather than as three more full-width bands. `h-100`
      is what makes the three cards in a row end at the same edge.
    -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card flat border class="h-100">
          <v-card-title tag="h2" class="text-title-medium pt-4">
            {{ t('about_page.privacy.title') }}
          </v-card-title>

          <v-card-text class="prose text-body-medium">
            <i18n-t keypath="about_page.privacy.text" tag="p" scope="global">
              <template #link1>
                <a
                  href="https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('about_page.privacy.link1') }}
                </a>
              </template>

              <template #link2>
                <a
                  href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('about_page.privacy.link2') }}
                </a>
              </template>
            </i18n-t>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card flat border class="h-100">
          <v-card-title tag="h2" class="text-title-medium pt-4">
            {{ t('about_page.disclaimer.title') }}
          </v-card-title>

          <v-card-text class="prose text-body-medium">
            <p>{{ t('about_page.disclaimer.text_1') }}</p>
            <p>{{ t('about_page.disclaimer.text_2') }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card flat border class="h-100">
          <v-card-title tag="h2" class="text-title-medium pt-4">
            {{ t('about_page.ai.title') }}
          </v-card-title>

          <v-card-text class="prose text-body-medium">
            <p>{{ t('about_page.ai.text') }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { POPULATION_TRACKER, REPO, TRANSITION_TRACKER } from '@/utils/links'

const { t } = useI18n({ useScope: 'global' })
</script>
