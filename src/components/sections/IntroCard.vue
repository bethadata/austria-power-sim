<template>
  <v-card class="ps-2 mb-0 elevation-2">
    <v-row>
      <v-col>
        <v-card-title class="text-h5 font-weight-bold">
          {{ t('intro_card.welcome_text') }}
        </v-card-title>

        <v-card-text class="text-body-medium">
          <i18n-t keypath="intro_card.intro_text" tag="span">
          <template #intro_text_bold>
            <strong> {{ t('intro_card.intro_text_bold') }}  </strong>
          </template>
          </i18n-t>
        </v-card-text>

          </v-col>
       <v-col>
          <v-alert type="info" variant="tonal" class="my-alert ma-6">
          <i18n-t keypath="intro_card.info_box_text" tag="span">
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
  </v-card>
</template>


<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
</script>

<style>

.my-alert .v-alert__content {
  font-size: 0.9rem;
  line-height: 1.35;
}


</style>
