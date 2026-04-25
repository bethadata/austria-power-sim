import { createApp } from 'vue';
import vuetify from './plugins/vuetify.ts';
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import 'flag-icons/css/flag-icons.min.css'

const app = createApp(App);
app.use(vuetify); 
app.use(router);
app.use(i18n);
app.mount('#app')
