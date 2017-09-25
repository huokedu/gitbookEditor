<template>
  <div id="APIPlusDocument" v-if="$route.path !== '/login'">
    <nav-bar></nav-bar>
    <div class="main-content">
      <nav-title></nav-title>
      <router-view></router-view>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import navBar from './components/widget/nav_menu'
import navTitle from './components/widget/nav_title'
import { setupConnection } from './utils/connect.js'
import {getSession} from './api/session.js'
import Axios from './api'
export default {
  name: 'app',
  mounted () {
    const vm = this
    const token = vm.$store.state.power.token
    if (token) {
      // 设置权限请求头
      vm.VetifyPower(token)
      setupConnection(token, vm)
      getSession(token).then(res => {
        if (res.data.status === 200) {
          vm.$store.commit('message/GET_SESSION', res.data.data.sessions)
        }
      })
    }
  },
  methods: {
    VetifyPower (token) {
      Axios.defaults.headers = {'X-Token-Header': token}
      Axios.interceptors.response.use(function (config) {
        // 在发送请求之前做些什么
        console.log(config)
        return config
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      })
    }
  },
  components: {
    navBar,
    navTitle
  }
}
</script>

<style>
html {
  min-width: 1330px;
}
#APIPlusDocument {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
li {
  list-style: none;
}
#APIPlusDocument .main-content {
  margin-left: 40px;
}
</style>
