import './main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import Hardware from './pages/Hardware.vue'
import ConstantWave from './pages/ConstantWave.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/hardware.html', component: Hardware },
    { path: '/cw.html', component: ConstantWave },
  ],
})

createApp(App)
  .use(router)
  .mount('#app')
