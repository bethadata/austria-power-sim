<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <!--
    One block of prose, full page width, no expander.
    The welcome used to be a two-column card with an info alert and a call to
    action folded behind a "More about this" toggle, which meant the one thing a
    first-time reader has to see -- that the model has limits, and where they are
    written down -- was the part hidden by default. It is a sentence in the lead
    now, carrying the same link.
  -->
  <v-card flat border class="px-4 py-3">
    <h1 class="text-title-large">{{ t('intro_card.welcome_text') }}</h1>

    <p class="text-body-medium text-medium-emphasis mt-2">
      <i18n-t keypath="intro_card.intro_text" tag="span" scope="global">
        <template #intro_text_bold>
          <strong>{{ t('intro_card.intro_text_bold') }}</strong>
        </template>
      </i18n-t>
      {{ ' ' }}
      <i18n-t keypath="intro_card.info_box_text" tag="span" scope="global">
        <template #info_box_strong>
          <strong>{{ t('intro_card.info_box_strong') }}</strong>
        </template>
        <template #info_box_link>
          <router-link to="/model" class="text-primary font-weight-medium">
            {{ t('intro_card.info_box_link') }}
          </router-link>
        </template>
      </i18n-t>
    </p>
  </v-card>
</template>
