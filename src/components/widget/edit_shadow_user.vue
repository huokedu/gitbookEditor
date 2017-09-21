<template>
  <div id="editUser">
    <div class="line">
      <span class="title">用户名称:</span>
      <span class="content"><el-input v-model="name"></el-input></span>
      <span class="handdle"><el-button @click="generateName" v-if="power.has('shadow/generate/name')">一键生成</el-button></span>
    </div>
    <div class="line">
      <span class="title">头像:</span>
      <span class="content">
        <span class="avatar"><img :src="avatar" alt=""></span>
      </span>
      <span class="handdle">
        <el-button @click="generateAvatar" v-if="power.has('shadow/generate/avatar')">切换头像</el-button>
        <span v-show="pending" style="display:inline; padding: 20px;">头像请求中...</span>
        <span v-show="show" style="display:inline; color: red; padding: 20px;">图片加载失败，请切换头像</span>
      </span>
    </div>
    <div class="line" style="text-align: center">
      <el-button @click="generateUser" v-if="power.has('shadow/generate/user')">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  generateName,
  generateAvatar,
  generateUser
} from '../../api/shadow.js'
export default {
  name: 'edit_shadow_user',
  props: ['user'],
  data () {
    return {
      avatar: '',
      name: '',
      id: '',
      message: '',
      show: false,
      pending: false
    }
  },
  mounted () {
    const vm = this
    vm.getImage(vm.user.avatar)
    vm.name = vm.user.name ? vm.user.name : ''
    vm.id = vm.user._id ? vm.user._id : ''
  },
  methods: {
    // 缓存请求图片
    getImage (avatar) {
      const vm = this
      if (!avatar) return
      vm.avatar = ''
      vm.pending = true
      const image = new Image()
      image.onload = () => {
        vm.pending = false
        vm.avatar = avatar
      }
      image.onerror = () => {
        vm.pending = false
        vm.show = true
      }
      image.src = avatar
    },
    generateName () {
      const vm = this
      generateName().then(res => {
        if (res.data.status === 200) {
          vm.name = res.data.data.user.name
        }
      })
    },
    generateAvatar () {
      const vm = this
      vm.show = false
      generateAvatar().then(res => {
        if (res.data.status === 200) {
          vm.getImage(res.data.data.user.avatar)
        }
      })
    },
    generateUser () {
      const vm = this
      vm.errMsg = ''
      if (!vm.name || !vm.avatar) {
        return vm.$message({
          type: 'warning',
          message: '名字和头像不能为空'
        })
      }
      generateUser({name: vm.name, avatar: vm.avatar, id: vm.id}).then(res => {
        if (res.data.status === 200) {
          const message = vm.id ? '修改成功' : '创建成功'
          vm.$emit('update', res.data.data.user)
          vm.$message({
            type: 'success',
            message
          })
        }
      })
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
#editUser .line{
  line-height: 80px;
  font-size: 14px;
  text-align: left;  
}
#editUser .avatar {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  vertical-align: middle;
  background: url('../../assets/user.png') no-repeat center/100%;
  overflow: hidden;
}
#editUser .avatar img {
  width: 100%;
  height: 100%;
}
#editUser .line span {
  display: inline-block;
}
#editUser .line .title {
  width: 120px;
  text-align: right;
}
#editUser .line .content {
  width: 200px;
  padding: 0 40px;
}
</style>
