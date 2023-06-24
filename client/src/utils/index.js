import { LockalStorage } from '@/store/localstorage'

import bigDecimal from 'js-big-decimal'

export const serial = 'd4848aef-713d-4007-b688-ba31ef46576c'

export const token = LockalStorage.read('token', '')

export const api = 'https://awex.pro/b2api'
// export const api = '/b2api'

const initialValue = { workstation: {} }

/**
 * @param {Number|String} num
 * @param {Number} precision
 * @return {String}
 */
export const convert = (num, precision = 2) => {
  return bigDecimal.getPrettyValue(
    bigDecimal.round(num, precision, bigDecimal.RoundingModes.CEILING),
    3,
    ' '
  )
}

/**
 * @param {String} token
 * @return {Boolean}
 */
export const writeToken = token => LockalStorage.write({ token })

/**
 * @return {Boolean}
 */
export const removeToken = () => LockalStorage.remove(['token'])

/**
 * @param state
 * @return {Object}
 */
export const loginData = state => Object.keys(state)
  .reduce((acc, k) => {
    if (['list','serial','token','error','need2FA'].includes(k)) {
      return acc
    }
    if (k === 'g2fa') {
      acc.factors = state.g2fa !== ''
        ? { g2fa: state.g2fa }
        : {}

    } else {
      acc[k] = state[k]
    }

    return acc

  }, initialValue)
