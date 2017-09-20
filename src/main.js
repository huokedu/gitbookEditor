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
// element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  // ...
  if (to.path !== '/login' && store.state.power.token === '') {
    return next('/login')
  }
  next()
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
