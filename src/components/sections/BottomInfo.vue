<template>
  <v-card class="pa-4">
      <CardTitleWithTooltip
            :title="t('bottom_info.title')"
            :tooltip="t('bottom_info.tooltip')"
      />   
      <v-card-text class="pt-0">
      <p>{{ t('bottom_info.info') }}</p>
      <v-alert
        type="warning"
        variant="tonal"
        border="start"
        class="my-0"
      >

      <strong>{{ t('bottom_info.disclaimer_title') }}</strong>

      <i18n-t keypath="bottom_info.disclaimer" tag="span" scope="global">
        <template #link>
          <router-link to="/model" class="text-primary font-weight-medium">
            {{ t('bottom_info.disclaimer_link') }}
          </router-link>
        </template>
      </i18n-t>
      </v-alert>    
    </v-card-text>
  </v-card>
</template>


<script setup lang="ts">
  import CardTitleWithTooltip from '../model/CardTitleWithTooltip.vue';
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({ useScope: 'global' })
</script>