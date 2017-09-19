<template>
  <div id="login" @click="isLogin = false" :class="{isLogin: isLogin}">
    <div class="wrapper">
      <h1>API<span>S</span></h1>
      <h2>我们的征途是星辰大海</h2>
      <transition name="up" mode="out-in">  
      <el-button type="primary" @click.stop="isLogin = true" v-if="!isLogin">来呀,快活呀</el-button>
      <section class="form-area" v-else @click.stop>
        <el-input v-model="phone" placeholder="用户名/手机号"></el-input>
        <el-input v-model="pwd" placeholder="密码" type="password"></el-input>
        <el-button type="success" @click="validate">要登就登,赶紧的</el-button>
      </section>
      </transition>
    </div>    
  </div>
</template>

<script>
import {Login} from '../api/power.js'
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
          vm.$store.commit('power/CHANGE_LOGIN', true)
          vm.$store.commit('power/GET_POWER_LIST', res.data.data)
          vm.$router.push({path: '/'})
        } else {
          vm.$message({
            type: 'error',
            message: '账号或密码错误'
          })
        }
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
