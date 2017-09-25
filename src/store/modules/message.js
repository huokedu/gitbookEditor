import {
  GET_MESSAGE,
  END_MESSAGE,
  COMBINE_MESSAGE,
  GET_SESSION
} from '../mutations'

const state = {
  msgList: [],
  sessions: []
}

const actions = {

}

const mutations = {
  [GET_MESSAGE] (state, msg) {
    state.msgList.push(...msg)
  },
  [COMBINE_MESSAGE] (state, msg) {
    state.msgList = msg
  },
  [END_MESSAGE] (state, msg) {
    state.msgList.unshift({end: true})
  },
  [GET_SESSION] (state, sessions) {
    state.sessions = sessions
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
