import {
  CHANGE_TITLE,
  CHANGE_SELECTED,
  GET_DIR,
  GET_SEC_DIR,
  ADD_DIR,
  DEL_DIR,
  UPDATE_DIRECTORY,
  GET_SORT,
  GET_APITITLE,
  GET_TAGS,
  RECYCLE_STATUS,
  GET_LIST,
  CHANGE_LIST,
  ADD_LIST,
  GET_SELECTED,
  DELETE_TAG,
  ADD_TAG
 } from '../mutations'

// initial state
// shape: [{ id, quantity }]
const state = {
  article: {},
  title: '',
  chooseDir: true,
  levelOne: [],
  levelTwo: {},
  sort: undefined,
  APITitle: 'API文档',
  tags: [],
  isRecycle: false,
  list: [],
  selectedIndex: ''
}

// getters

const getters = {

}

// actions
const actions = {
  // 修改标题
  changeTitle ({commit}, title) {
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
  modifyDir ({commit}, { index, title }) {
    if (title) {
      commit('ADD_DIR', { index, title })
      return
    }
    commit('DEL_DIR', index)
  },
  // 获取当前分类
  getSort ({commit}, id) {
    commit('GET_SORT', id)
  },
  getAPITitle ({commit}, title) {
    commit('GET_APITITLE', title)
  },
  // 获取标签
  getTags ({commit, state}, tags) {
    if (!Array.isArray(tags)) {
      const status = state.tags.some((tag, index) => {
        if (tag._id === tags._id) {
          commit('DELETE_TAG', index)
          return true
        }
      })
      if (!status) commit('ADD_TAG', tags)
      return
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
    state.article.title = title
    state.title = title
    state.list.map((article, index) => {
      if (state.article._id === article._id) {
        state.list.splice(index, 1, { _id: article._id, title: state.article.title })
      }
    })
  },
  [CHANGE_SELECTED] (state, article) {
    state.article = article
    state.title = article.title
    state.chooseDir = article.status
  },
  [GET_DIR] (state, {levelOne}) {
    state.levelOne = levelOne
  },
  [ADD_DIR] (state, { index, title }) {
    state.levelOne.splice(index, 1, title)
  },
  [DEL_DIR] (state, index) {
    delete state.levelTwo[state.levelOne[index]]
    state.levelOne.splice(index, 1)
  },
  [UPDATE_DIRECTORY] (state, { dir, secDir }) {
    state.levelOne = dir
  },
  [GET_SEC_DIR] (state, {levelTwo}) {
    state.levelTwo = levelTwo
  },
  [GET_SORT] (state, id) {
    state.sort = id
  },
  [GET_APITITLE] (state, title) {
    state.APITitle = title
  },
  [GET_TAGS] (state, tags) {
    state.tags = tags
  },
  [DELETE_TAG] (state, index) {
    state.tags.splice(index, 1)
  },
  [ADD_TAG] (state, tag) {
    state.tags.splice(state.tags.length, 1, tag)
  },
  [RECYCLE_STATUS] (state, status) {
    state.isRecycle = status
  },
  [GET_LIST] (state, list) {
    state.list = list
  },
  [CHANGE_LIST] (state, index) {
    if (!index) {
      state.list.splice(state.selectedIndex, 1)
      state.selectedIndex = 0
      console.log(state.list[0])
      const article = state.list[0]
      if (!article) {
        state.article = {
          _id: '',
          status: '',
          title: ''
        }
        state.title = ''
        return
      }
      article.status = false
      state.article = article
      state.title = article.title
      state.chooseDir = article.status
      return
    }
    state.list.splice(index, 1)
  },
  [ADD_LIST] (state, item) {
    state.list.splice(0, 0, item)
  },
  [GET_SELECTED] (state, index) {
    state.selectedIndex = index
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
