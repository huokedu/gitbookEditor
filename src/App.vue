<template>
  <div id="APIPlusDocument" v-if="$route.path !== '/login' && $route.name !== '404'">
    <nav-bar v-if="$route.path !== '/login'"></nav-bar>
    <div class="main-content">
      <nav-title v-if="$route.path !== '/login'"></nav-title>
      <router-view></router-view>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import navBar from './components/widget/nav_menu'
import navTitle from './components/widget/nav_title'
// import { setupConnection } from './utils/connect.js'
// import {getSession} from './api/session.js'
import Axios from './api'
export default {
  name: 'app',
  mounted () {
    const vm = this
    const token = vm.$store.state.power.token
    if (token && vm.$route.path !== '/login') {
      // 设置权限请求头
      vm.VetifyPower(token)
      // 有客服权限时
      // if (vm.power.has('customer/session/query')) {
      //   setupConnection(token, vm)
      //   getSession(token).then(res => {
      //     if (res.data.status === 200) {
      //       vm.$store.commit('message/GET_SESSION', res.data.data.sessions)
      //     }
      //   })
      // }
    }
  },
  methods: {
    VetifyPower (token) {
      const vm = this
      Axios.defaults.headers = {'X-Token-Header': token}
      Axios.interceptors.response.use(function (res) {
        // 在发送请求之前做些什么
        if (res.data.status > 6000) {
          if (res.data.message === '请求参数不完整') return vm.$router.replace('/404')
          vm.$confirm(`${res.data.message},是否返回登录页面`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            vm.$store.commit('power/QUIT_LOGIN')
            vm.$router.push('/login')
            return res
          }).catch(() => {
            return res
          })
        }
        return res
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      })
    }
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
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
img[src=""] {
  opacity: 0;
}
</style>
