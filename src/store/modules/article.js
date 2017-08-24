import {
  CHANGE_TITLE,
  CHANGE_SELECTED,
  GET_DIR,
  GET_SORT
 } from '../mutations'

// initial state
// shape: [{ id, quantity }]
const state = {
  article: { _id: '', title: '' },
  title: '',
  chooseDir: true,
  directory: [],
  sort: ''
}

// getters

const getters = {
}

// actions
const actions = {
  // 修改标题
  changeTitle ({commit, state}, title) {
    commit('CHANGE_TITLE', title)
  },
  // 修改选中
  changeSelected ({commit}, article) {
    commit('CHANGE_SELECTED', article)
  },
  // 获取目录
  getDir ({commit}, dir) {
    commit('GET_DIR', dir)
  },
  // 获取当前分类
  getSort ({commit}, id) {
    commit('GET_SORT', id)
  }
}

// mutations
const mutations = {
  [CHANGE_TITLE] (state, title) {
    state.title = title
  },
  [CHANGE_SELECTED] (state, article) {
    state.article.title = article.title
    state.article._id = article._id
    state.chooseDir = article.status
  },
  [GET_DIR] (state, dir) {
    state.directory = dir
  },
  [GET_SORT] (state, id) {
    state.sort = id
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
