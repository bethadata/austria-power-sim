<template>
  <v-card class="pa-4">
      <CardTitleWithTooltip
            :title="t('bottom_info.title')"
            :tooltip="t('bottom_info.tooltip')"
      />   
      <v-card-text>
      <v-alert
        type="warning"
        variant="tonal"
        border="start"
        class="my-0"
      >
        <!-- <strong>Disclaimer:</strong>
        This is a highly simplified model to understand system scales. It does not represent real-world system behavior, as several 
        factors are neglected. For example, solar generation timeseries are not very well represented with historic data from ENTSO-E. 
        Check the corresponding section on Limitations on the
        <router-link to="/model" class="text-primary font-weight-medium">
          Models & Data page
        </router-link>.   -->
        
      <strong>{{ t('bottom_info.disclaimer_title') }}</strong>

      <i18n-t keypath="bottom_info.disclaimer" tag="span">
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
  const { t } = useI18n()
</script>