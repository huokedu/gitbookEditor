<template>
  <el-menu default-active="1" 
  class="el-menu-vertical-demo"
  mode="horizontal"
  :unique-opened="true">
    <el-dropdown>
      <span class="el-dropdown-link">
        <img src="../../assets/logo.png" alt="">
        <span>下拉菜单</span>
        <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(route, index) in routeList" :key="index">{{route}}</el-breadcrumb-item>
    </el-breadcrumb>   
  </el-menu>
</template>

<script>
import { Menu, Dropdown, DropdownMenu, DropdownItem, Breadcrumb, BreadcrumbItem } from 'element-ui'
export default {
  name: 'nav_menu',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    routeList () {
      return this.$route.name.split('/')
    }
  },
  components: {
    elMenu: Menu,
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
    elDropdown: Dropdown,
    elDropdownMenu: DropdownMenu,
    elDropdownItem: DropdownItem
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
  vertical-align: middle;
}
.el-breadcrumb{
  line-height: 60px;
  margin-left: 20px;
}
</style>