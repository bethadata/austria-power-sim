import { createRouter, createWebHashHistory } from 'vue-router'

import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import ModelView from '@/views/ModelView.vue'

// Hash mode: GitHub Pages has no rewrite rules, so a deep path would 404 on
// reload. vite.config.ts sets `base` for the asset paths.
export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/model', name: 'model', component: ModelView },
    { path: '/about', name: 'about', component: AboutView },
  ],
})
