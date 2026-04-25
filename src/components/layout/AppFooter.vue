<template>

<v-footer app class="footer">
  <div class="footer-content">
    <div class="text-caption">
      © 2026 Austria Power Simulator
    </div>

    <div class="d-flex align-center ga-1">
      <v-btn icon variant="text" size="x-small" href="https://github.com/bethadata/austria-power-sim" target="_blank">
        <v-icon size="16">mdi-github</v-icon>
      </v-btn>

      <v-btn icon variant="text" size="x-small" href="https://bsky.app/profile/thalerb.bsky.social" target="_blank">
          <img src="../../assets/bluesky.svg" width="15" height="15" />
      </v-btn>
    </div>
  </div>
</v-footer>

</template>

<style>

.footer {
  min-height: 28px;
  padding: 0.2%;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: left;

  padding: 0 6px;
  width: 100%;
}

.footer .v-btn {
  padding: 0;
  min-width: 0;
}


</style>