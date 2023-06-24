import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import '@/plugins/big-decimal'
import '@/plugins/axios'

import { EventBus } from '@/utils/event-bus'

Vue.config.productionTip = false
Vue.prototype.$bus = EventBus

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
