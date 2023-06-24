import Vue from 'vue'
import Vuex from 'vuex'

import {

  writeToken,
  removeToken,
  loginData,
  serial,
  token,
  api

} from '@/utils'

import {

  FETCH_LIST_ACTION,
  USER_LOGIN_ACTION,
  USER_LOGOUT_ACTION,
  USER_TRANSFER_ACTION,
  USER_INFO_ACTION,

  SET_LOGIN_MUTATION,
  SET_PASS_MUTATION,
  SET_G2FA_MUTATION,
  SET_LIST_MUTATION,
  SET_CURR_MUTATION,
  SET_CODE_MUTATION,

  SET_MUTATION

} from './types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: () => ({
    serial,
    token,
    login: '',
    pass: '',
    g2fa: '',

    sendTransfer2FA: null,
    sendTransferCode: null,
    sendTransferAmount: null,
    acceptTransferCode: null,
    relativeCurrency: null,
    list: [],

    need2FA: false,
    error: null
  }),
  getters: {
    sendTransferCode: state => state.sendTransferCode,
    relativeCurrency: state => state.relativeCurrency,

    token: state => state.token,
    login: state => state.login,
    pass: state => state.pass,
    g2fa: state => state.g2fa,

    headers: ({ serial, token }) => {
      return {
        'Content-Type': 'application/json; charset=UTF-8',

        ...(token && { token }),

        serial
      }
    }
  },
  mutations: {
    [SET_MUTATION](state, payload)
    {
      Object.keys(payload).forEach(key => state[key] = payload[key])
    },
    [SET_LOGIN_MUTATION](state, login)
    {
      state.login = login
    },
    [SET_PASS_MUTATION](state, pass)
    {
      state.pass = pass
    },
    [SET_G2FA_MUTATION](state, g2fa)
    {
      state.g2fa = g2fa
    },
    [SET_LIST_MUTATION](state, list)
    {
      state.list = list
    },
    [SET_CODE_MUTATION](state, acceptTransferCode)
    {
      state.acceptTransferCode = acceptTransferCode
    },
    [SET_CURR_MUTATION](state, relativeCurrency)
    {
      state.relativeCurrency = relativeCurrency
    }
  },
  actions: {
    async [USER_LOGIN_ACTION]({ state, getters, commit })
    {
      switch (true) {
        case !state.login && !state.pass:
          state.error = { message: 'Credentials needed' }
          return false

        case !state.login:
          state.error = { message: 'Login needed' }
          return false

        case !state.pass:
          state.error = { message: 'Password needed' }
          return false
      }

      const postData = loginData(state)
      const headers = getters.headers

      try {

        const { data, status } = await Vue.axios.post(
          `${api}/user/auth`,
          postData,
          { headers }
        )

        if (status === 200 && data.token) {
          commit(SET_MUTATION, { token: data.token, need2FA: data.need2FA })
          return writeToken(data.token)

        } else if (data.need2FA) {
          commit(SET_MUTATION, { need2FA: false })
          await new Promise(resolve => setTimeout(resolve))
          commit(SET_MUTATION, { need2FA: data.need2FA })

        } else {
          state.error = data
        }

      } catch (e) {
        state.error = e
      }

      return false
    },
    async [USER_LOGOUT_ACTION]({ state, getters, commit })
    {
      const headers = getters.headers

      try {

        const { data, status } = await Vue.axios.post(
          `${api}/user/revoke/${state.token}`,
          {},
          { headers }
        )

        if (status === 200 && data.message === 'OK') {
          commit(SET_MUTATION, { token: '', g2fa: '', need2FA: false })
          return removeToken()
        } else {
          state.error = data
        }

      } catch (e) {
        state.error = e
      }

      return false
    },

    /** @attention how to test it */
    async [USER_TRANSFER_ACTION]({ state, getters /*, commit */ }, asset)
    {
      const headers = getters.headers

      try {

        const { data, status } = await Vue.axios.post(
          `${api}/transfer/user`,
          {
            cur: asset,
            code: state.sendTransferCode,       // код другого пользователя
            amount: state.sendTransferAmount,   // кол-во актива
            factors: {                          // 2‑й фактор
              g2fa: state.sendTransfer2FA
            }
          },
          { headers }
        )

/////////////////////////////////////////////////////////////////////////////////////////
const style = 'text-shadow: #a0f9fa 0 0 2px; font-family: monospace; font-size: 1.4em;'
console.log(`%c
ENDPOINT: /transfer/user
STATUS: ${status}
DATA: ${JSON.stringify(data, null, 2)}`,
  style
)
/////////////////////////////////////////////////////////////////////////////////////////

        if (status === 200) {
          // commit(SET_MUTATION, { data? })
          return true
        } else {
          state.error = data
        }

      } catch (e) {
        state.error = e
      }

      return false
    },

    async [USER_INFO_ACTION]({ state, getters, commit })
    {
      const headers = getters.headers

      try {

        const { data, status } = await Vue.axios.post(
          `${api}/user/info`,
          {},
          { headers }
        )

        if (status === 200) {
          commit(SET_CODE_MUTATION, data.transferCode)
          return true
        } else {
          state.error = data
        }

      } catch (e) {
        state.error = e
      }

      return false
    },
    async [FETCH_LIST_ACTION]({ state, getters, commit })
    {
      const headers = getters.headers

      try {

        const { data, status } = await Vue.axios.post(
          `${api}/asset/wallet/list`,
          {},
          { headers }
        )

        if (status === 200 && data.list.length) {
          commit(SET_CURR_MUTATION, data.summCur)

          commit(SET_LIST_MUTATION, data.list.map(asset => ({
            ...asset,

            active: false
          })))

          return true
        } else {
          state.error = data
        }

      } catch (e) {
        state.error = e
      }

      return false
    }
  }
})

/**
 * @return {Promise<Boolean>}
 */
export const logout = () => store.dispatch(USER_LOGOUT_ACTION)

/**
 * @return {Promise<Boolean>}
 */
export const login = () => store.dispatch(USER_LOGIN_ACTION)

export default store
