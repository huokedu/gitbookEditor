<template>
  <el-menu default-active="1" 
  class="el-menu-vertical-demo"
  mode="horizontal"
  :unique-opened="true">
    <el-dropdown trigger="click" style="cursor: pointer" @command="quitLogin">
      <span class="el-dropdown-link">
        <img :src="avatar | link" alt="头像">
        <span>{{name}}</span>
        <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="edit">编辑个人资料</el-dropdown-item>
        <el-dropdown-item command="quit">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(route, index) in routeList" :key="index">{{route}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dialog
      :visible.sync="editVisible"
      size="tiny"
      >
       <edit-user v-if="editVisible" user=""></edit-user>   
    </el-dialog> 
  </el-menu>
</template>

<script>
import editUser from '../widget/edit_user'
import { mapState } from 'vuex'
export default {
  name: 'nav_menu',
  data () {
    return {
      isCollapse: false,
      editVisible: false
    }
  },
  computed: {
    routeList () {
      return this.$route.name.split('/')
    },
    ...mapState('power', [
      'avatar', 'name'
    ])
  },
  methods: {
    quitLogin (status) {
      const vm = this
      if (status === 'quit') {
        vm.$store.commit('power/QUIT_LOGIN')
        vm.$router.push('/login')
      } else {
        vm.editUser()
      }
    },
    editUser () {
      const vm = this
      vm.editVisible = true
    }
  },
  components: {
    editUser
  }
}
</script>

<style scoped>
.el-dropdown {
  float: right;
  margin-right: 20px;
  height: 60px;
  line-height: 60px;
}
.el-dropdown-link img {
  width: 30px;
  height: 30px;
  margin-right: 6px;
  border-radius: 4px;
  vertical-align: middle;
}
.el-breadcrumb{
  line-height: 60px;
  margin-left: 20px;
}
</style>