<template>
  <div id="login" @click="isLogin = false" :class="{isLogin: isLogin}">
    <div class="wrapper">
      <h1>API<span>S</span></h1>
      <h2>我们的征途是星辰大海</h2>
      <transition name="up" mode="out-in">  
      <el-button type="primary" @click.stop="isLogin = true" v-if="!isLogin">来呀,快活呀</el-button>
      <section class="form-area" v-else @click.stop>
        <el-input v-model="phone" placeholder="用户名/手机号"></el-input>
        <el-input v-model="pwd" placeholder="密码" type="password" @keyup.enter.native="validate"></el-input>
        <el-button type="success" @click="validate">要登就登,赶紧的</el-button>
      </section>
      </transition>
    </div>    
  </div>
</template>

<script>
import {Login} from '../api/power.js'
// import { setupConnection } from '../utils/connect.js'
// import {getSession} from '../api/session.js'
import Axios from '../api'
export default {
  name: 'login',
  data () {
    return {
      phone: '',
      pwd: '',
      isLogin: false
    }
  },
  methods: {
    Login () {
      const vm = this
      Login({phone: vm.phone, password: vm.pwd}).then(res => {
        if (res.data.status === 200) {
          const token = res.data.data.user.token
          vm.VetifyPower(token)
          vm.$store.commit('power/CHANGE_LOGIN', true)
          vm.$store.commit('power/GET_POWER_LIST', res.data.data)
          // 有客服权限时，建立客服链接
          // if (vm.power.has('customer/session/query')) {
          //   setupConnection(token, vm)
          //   getSession(token).then(res => {
          //     if (res.data.status === 200) {
          //       vm.$store.commit('message/GET_SESSION', res.data.data.sessions)
          //     }
          //   })
          // }
          vm.$router.push({path: '/home'})
        } else {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    VetifyPower (token) {
      const vm = this
      Axios.defaults.headers = {'X-Token-Header': token}
      Axios.interceptors.response.use(function (res) {
        // 在发送请求之前做些什么
        if (res.data.status > 6000) {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
          vm.$router.push('/login')
          return
        }
        return res
      }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      })
    },
    // 验证账号密码
    validate () {
      const vm = this
      if (!/0?(13|14|15|18|17)[0-9]{9}/.test(vm.phone)) {
        return vm.$message({
          type: 'warning',
          message: '请输入合法手机号'
        })
      }
      if (!/^[A-Za-z][\w]{7,29}/.test(vm.pwd)) {
        return vm.$message({
          type: 'warning',
          message: '密码必须以字母开头,密码长度大于8小于30'
        })
      }
      vm.Login()
    }
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  }
}
</script>

<style scoped>
#login {
  position: relative;
  padding: 1px;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  color: #fff;
  background: #4db3ff url('../assets/login.jpg') no-repeat center/cover;
}
#login.isLogin::before {
  content: '';
  background-color: #000;
}
#login h1 span {
  font-weight: 100;
}
#login::before{
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: .4;
  background-color: rgba(0,0,0,.3);  
  transition: all .5s;      
}
#login .wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 20px;
  width: 300px;
  height: 350px;
  line-height: 50px;
  text-align: center;
  margin: auto;
}
.up-enter-active, .up-leave-active {
  transform: translateY(0px);
  transition: all .5s;
}
.up-enter, .up-leave-to {
  opacity: 0;
  transform: translateY(-40px)
}
</style>
