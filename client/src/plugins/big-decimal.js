import bigDecimal from 'js-big-decimal'
import Vue from 'vue'

const bigDecimalPlugin = (Vue /*, options */) => {
  Vue.prototype.$bigDecimal = options => {
    return new bigDecimal(options)
  }
}

Vue.use(bigDecimalPlugin)

export default bigDecimalPlugin
