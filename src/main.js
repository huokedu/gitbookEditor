import Vue from 'vue'
import App from './App'
import router from './router'
// mardown编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'normalize.css'
Vue.use(mavonEditor)
Vue.config.productionTip = false
// 状态管理
import store from './store'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
