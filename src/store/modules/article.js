import {
  CHANGE_TITLE,
  CHANGE_SELECTED,
  GET_DIR,
  GET_SORT,
  GET_APITITLE,
  GET_TAGS,
  RECYCLE_STATUS
 } from '../mutations'

// initial state
// shape: [{ id, quantity }]
const state = {
  article: {},
  title: '',
  chooseDir: true,
  directory: [],
  sort: undefined,
  APITitle: 'API文档',
  tags: [],
  status: false
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
  },
  getAPITitle ({commit}, title) {
    commit('GET_APITITLE', title)
  },
  // 获取标签
  async getTags ({commit, state}, tags) {
    if (!Array.isArray(tags)) {
      const set = new Set(state.tags)
      if (set.has(tags)) {
        set.delete(tags)
      } else {
        set.add(tags)
      }
      tags = [...set]
    }
    commit('GET_TAGS', tags)
  },
  getStatus ({commit}, status) {
    commit('RECYCLE_STATUS', status)
  }
}

// mutations
const mutations = {
  [CHANGE_TITLE] (state, title) {
    state.title = title
  },
  [CHANGE_SELECTED] (state, article) {
    state.article = article
    state.chooseDir = article.status
  },
  [GET_DIR] (state, dir) {
    state.directory = dir
  },
  [GET_SORT] (state, id) {
    state.sort = id
  },
  [GET_APITITLE] (state, title) {
    state.docTitle = title
  },
  [GET_TAGS] (state, tags) {
    state.tags = tags
  },
  [RECYCLE_STATUS] (state, status) {
    state.status = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
