import { createApp } from 'vue';
import vuetify from './plugins/vuetify.ts';
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use(vuetify); 
app.use(router);
app.mount('#app')
