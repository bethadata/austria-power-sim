<template>

<v-footer app class="footer">
  <div class="footer-content">
    <div class="text-body-small">
      © 2026 Austria Power Simulator
      <span class="d-none d-sm-inline">
        &middot; {{ t('footer.last_updated', { date: buildDate }) }}
      </span>
    </div>

    <div class="d-flex align-center ga-1">
      <v-btn icon variant="text" size="x-small" href="https://github.com/bethadata/austria-power-sim" target="_blank" rel="noopener noreferrer" :aria-label="t('footer.github')">
        <v-icon size="16">mdi-github</v-icon>
      </v-btn>

      <v-btn icon variant="text" size="x-small" href="https://bsky.app/profile/thalerb.bsky.social" target="_blank" rel="noopener noreferrer" :aria-label="t('footer.bluesky')">
        <!-- Inlined rather than <img src="../../assets/bluesky.svg">: an <img> renders
             the SVG as its own document, where fill="currentColor" resolves to black,
             so the icon was invisible on the dark theme. Inline it takes the button's colour. -->
        <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948" />
        </svg>
      </v-btn>
    </div>
  </div>
</v-footer>

</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Replaced at build time by vite's `define`, so it is a literal, not a reactive value.
const buildDate = __BUILD_DATE__
</script>

<style>

.footer {
  min-height: 28px;
  padding: 0.2%;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 6px;
  width: 100%;
}

.footer .v-btn {
  padding: 0;
  min-width: 0;
}


</style>
