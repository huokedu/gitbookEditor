import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import article from './modules/article'
import power from './modules/power'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  modules: {
    article,
    power
  },
  strict: debug
})
