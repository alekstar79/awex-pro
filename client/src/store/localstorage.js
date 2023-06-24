export class LockalStorage
{
  static KEY = 'awex'

  /**
   * @param {String?} key
   * @param {*} defaultValue
   * @returns {Object}
   */
  static read(key, defaultValue = null)
  {
    try {

      const data = JSON.parse(localStorage.getItem(LockalStorage.KEY) || '{}')

      return key ? (data[key] || defaultValue) : data

    } catch (e) {
      // do something...
    }

    return defaultValue
  }

  /**
   * @param {Object} payload
   * @return {Boolean}
   */
  static write(payload)
  {
    try {

      const data = JSON.parse(localStorage.getItem(LockalStorage.KEY) || '{}')

      Object.assign(data, payload)

      localStorage.setItem(LockalStorage.KEY, JSON.stringify(data))

      return true

    } catch (e) {
      // do something...
    }

    return false
  }

  /**
   * @param {Array} keys
   * @return {Boolean}
   */
  static remove(keys)
  {
    try {

      const data = JSON.parse(localStorage.getItem(LockalStorage.KEY) || '{}')

      const set = Object.keys(data).reduce((acc, k) => {
        if (!keys.includes(k)) {
          acc[k] = data[k]
        }

        return acc

      }, {})

      localStorage.setItem(LockalStorage.KEY, JSON.stringify(set))

      return true

    } catch (e) {
      // do something...
    }

    return false
  }
}
