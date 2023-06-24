import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { logout } from '@/store'

 axios.interceptors.response.use(
  response => Promise.resolve(response),
  logout
)

Vue.use(VueAxios, axios)
