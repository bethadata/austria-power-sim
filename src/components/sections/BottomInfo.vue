<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PanelCard from '@/components/ui/PanelCard.vue'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <PanelCard :title="t('bottom_info.title')" tag="h2">
    <p class="text-body-medium mb-3">{{ t('bottom_info.info') }}</p>

    <v-alert type="warning" variant="tonal" density="compact" border="start" class="text-body-small">
      <strong>{{ t('bottom_info.disclaimer_title') }}</strong>
      <i18n-t keypath="bottom_info.disclaimer" tag="span" scope="global">
        <template #link>
          <router-link to="/model" class="text-primary font-weight-medium">
            {{ t('bottom_info.disclaimer_link') }}
          </router-link>
        </template>
      </i18n-t>
    </v-alert>
  </PanelCard>
</template>
