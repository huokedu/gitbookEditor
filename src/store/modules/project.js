import {
  GET_CLIENT,
  CHANGE_CLIENT,
  CHANGE_COVER,
  CHECK_SAVE,
  SAVE_SHOW,
  DEL_SHOW,
  CHANGE_LINK,
  SAVE_UI,
  DEL_UI,
  CHANGE_PROGRESS
} from '../mutations'
import {serverPath} from '../../../config/path'
const state = {
  platform: 'android',
  clients: [],
  checkIndex: 0,
  isSave: false
}

const actions = {

}

const mutations = {
  [GET_CLIENT] (state, clients) {
    state.clients = clients.filter(client => {
      client.delShow = []
      client.link.ui = {url: client.link.ui}
      client.show = client.show.map(pic => {
        const url = pic.indexOf('http') === -1 ? `${serverPath}/${pic}` : pic
        return {url}
      })
      return true
    })
  },
  [CHANGE_CLIENT] (state, index) {
    state.checkIndex = index
    state.platform = state.clients[index].name
  },
  [CHANGE_COVER] (state, file) {
    state.clients[state.checkIndex].file = file
    state.clients[state.checkIndex].cover = URL.createObjectURL(file)
  },
  [CHECK_SAVE] (state, status) {
    if (!status) state.clients = []
    state.isSave = status
  },
  [SAVE_SHOW] (state, show) {
    state.clients[state.checkIndex].show = show
  },
  [DEL_SHOW] (state, url) {
    state.clients[state.checkIndex].delShow.push(url)
  },
  [CHANGE_LINK] (state, url) {
    state.clients[state.checkIndex].link.model = url
  },
  [DEL_UI] (state, file) {
    state.clients[state.checkIndex].link.ui = file
  },
  [SAVE_UI] (state, {vm, file}) {
    vm.$set(state.clients[state.checkIndex].link, 'ui', file)
  },
  [CHANGE_PROGRESS] (state, {vm, percentage}) {
    if (!state.clients[state.checkIndex].link.ui) return
    if (percentage === 100) {
      vm.$set(state.clients[state.checkIndex].link.ui, 'status', 'success')
    } else {
      vm.$set(state.clients[state.checkIndex].link.ui, 'status', 'uploading')
    }
    vm.$set(state.clients[state.checkIndex].link.ui, 'percentage', percentage)
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
