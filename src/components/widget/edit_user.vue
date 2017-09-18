<template>
  <div id="editUser">
    <div class="line">
      <span class="title">头像:</span>
      <span class="content">
        <span class="avatar"><img :src="avatar" alt=""></span>
      </span>
    </div>
    <div class="line">
      <span class="title">用户名称:</span>
      <span class="content"><el-input v-model="name"></el-input></span>
    </div>
    <div class="line">
      <span class="title">用户密码:</span>
      <span class="content"><el-input v-model="pwd"></el-input></span>
    </div>
    <div class="line" style="text-align: center">
      <el-button>保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'edit_shadow_user',
  props: ['user'],
  data () {
    return {
      pwd: ''
    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {
    ...mapState('power', [
      'name', 'avatar'
    ])
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
