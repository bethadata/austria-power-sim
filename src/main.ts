import { createApp } from 'vue'

import App from '@/App.vue'
import { i18n } from '@/i18n'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import '@/styles/app.css'

createApp(App).use(vuetify).use(i18n).use(router).mount('#app')
