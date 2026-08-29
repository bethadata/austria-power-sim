<template>
  <v-card class="ps-2 mb-0 elevation-2">
    <v-row class="mb-0 pb-0">
      <v-col class="pb-0">
          <v-card-title class="text-headline-small font-weight-bold" style="white-space: normal">
          {{ t('intro_card.welcome_text') }}
        </v-card-title>
      </v-col>
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-col cols="12" md="6" class="pt-1 pb-1">
        <v-card-text class="text-body-medium pt-0 pb-1">
          <i18n-t keypath="intro_card.intro_text" tag="span" scope="global">
          <template #intro_text_bold>
            <strong> {{ t('intro_card.intro_text_bold') }}  </strong>
          </template>
          </i18n-t>
        </v-card-text>

       </v-col>
       <v-col cols="12" md="6" class = "pb-1">
          <v-alert type="info" variant="tonal" class="my-alert ma-6 ml-3 mt-1 mb-2">
          <i18n-t keypath="intro_card.info_box_text" tag="span" scope="global">
          <template #info_box_link>
            <router-link to="/model" class="text-primary font-weight-medium">
            {{ t('intro_card.info_box_link') }}
            </router-link>
          </template>
          <template #info_box_strong>
            <strong>{{ t('intro_card.info_box_strong') }}</strong>
          </template>
          </i18n-t>
          </v-alert>
        </v-col>
     
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-alert
            type="success"
            variant="tonal"
            icon="mdi-play-circle-outline"
            class="my-alert cta-alert ml-3 mr-6 mb-4 mt-0"
          >
            <strong>{{ t('intro_card.cta_box_title') }}</strong> {{ t('intro_card.cta_box_text') }}
          </v-alert>
    </v-row>
  </v-card>
</template>


<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({ useScope: 'global' })
</script>

<style>

.my-alert .v-alert__content {
  font-size: 0.9rem;
  line-height: 1.35;
}



</style>
