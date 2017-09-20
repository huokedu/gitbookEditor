import {
  GET_POWER_LIST,
  CHANGE_LOGIN,
  QUIT_LOGIN,
  SELECTED_POWER,
  DELETE_POWER
} from '../mutations'

const state = {
  token: localStorage.token || '',
  powerList: localStorage.powers ? JSON.parse(localStorage.powers) : '',
  name: localStorage.name || '',
  avatar: localStorage.avatar || '',
  firstLogin: false,
  selectedPower: new Set()
}

const actions = {
  Login ({commit, state}, user) {
    state.firstLogin = false
    commit('GET_POWER_LIST', user)
  }
}

const mutations = {
  [GET_POWER_LIST] (state, user) {
    state.token = localStorage.token = user.user.token
    state.avatar = localStorage.avatar = user.user.avatar
    state.powerList = user.powers
    localStorage.powers = JSON.stringify(user.powers)
    state.name = localStorage.name = user.user.name
  },
  [CHANGE_LOGIN] (state, login) {
    state.firstLogin = login
  },
  [QUIT_LOGIN] (state) {
    state.token = localStorage.token = ''
    state.avatar = localStorage.avatar = ''
    state.powerList = ''
    localStorage.powers = ''
    state.name = localStorage.name = ''
  },
  [SELECTED_POWER] (state, power) {
    state.selectedPower = new Set([...state.selectedPower, ...power])
  },
  [DELETE_POWER] (state, power) {
    for (var i = 0; i < power.length; i++) {
      state.selectedPower.delete(power[i])
    }
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
