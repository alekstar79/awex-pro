import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.token) {
      next()
      return
    }
    next('/auth')
  } else {
    next()
  }
})

export default router
