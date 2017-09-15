<template>
<div class="wrapper">
  <el-menu :default-active="activeRoute" class="el-menu-vertical-demo el-icon-" theme="dark" 
  @select=changeView :unique-opened="true" :collapse="isCollapse">

  <el-menu-item index="1">
      <i class="el-icon-message"></i>
      <span slot="title">首页</span>
  </el-menu-item>

  <el-submenu index="项目">
    <template slot="title">
      <i class="el-icon-message"></i>
      <span slot="title">项目</span>
    </template>
    <el-menu-item index="/repo/repo_list">项目列表</el-menu-item>
    <el-menu-item index="/repo/repo_add">添加项目</el-menu-item>
    <el-menu-item index="/repo/tag">标签</el-menu-item>    
  </el-submenu>

  <el-submenu index="3">
    <template slot="title">
      <i class="el-icon-message"></i>
      <span slot="title">技术文档</span>
    </template>
    <el-menu-item index="/tech_list/list">文档列表</el-menu-item>
    <el-menu-item index="/tech_list/add">添加文档</el-menu-item>
  </el-submenu>

  <el-menu-item index="/order/order_list">
    <i class="el-icon-message"></i>
    <span slot="title">订单</span>
  </el-menu-item>

  <el-menu-item index="/comment/comment_list">
    <i class="el-icon-message"></i>
    <span slot="title">评论</span>
  </el-menu-item>

  <el-menu-item index="/member/member_list">
      <i class="el-icon-message"></i>
      <span slot="title">会员</span>
  </el-menu-item>

  <el-menu-item index="7">
      <i class="el-icon-message"></i>
      <span slot="title">管理员</span>
  </el-menu-item>

  <el-submenu index="8">
    <template slot="title">
      <i class="el-icon-d-arrow-left"></i>
      <span slot="title">经营数据</span>
    </template>
    <el-menu-item index="/statistics/incoming_statistics">收入统计</el-menu-item>
    <el-menu-item index="/statistics/api_statistics">接口调用统计</el-menu-item>
    <el-menu-item index="/statistics/ip_statistics">IP统计</el-menu-item>
    <!-- <el-menu-item index="8-4">调用日志</el-menu-item> -->
  </el-submenu>
  
  <el-submenu index="9">
    <template slot="title">
      <i class="el-icon-message"></i>
      <span slot="title">影子</span>
    </template>
    <el-menu-item index="/shadow/member_list">用户列表</el-menu-item>
    <el-menu-item index="/shadow/comment_list">评论列表</el-menu-item>
  </el-submenu>
  </el-menu>
</div>
</template>

<script>
export default {
  name: 'nav_menu',
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    activeRoute () {
      return this.$route.path
    }
  },
  methods: {
    changeView (index) {
      this.$router.push(index)
    }
  }
}
</script>

<style scoped>
.wrapper {
    width: 200px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    transition: all .28s ease-out;
    transform: translate(-160px,0);  
}
.el-menu-vertical-demo {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  min-height: 500px;
  transform: translate(152px, 0);
  transition: all .28s ease-out;
}
.wrapper:hover, .wrapper:hover .el-menu-vertical-demo {
  transform: translate(0,0);
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
.el-submenu .el-menu .el-menu-item{
  padding: 0 50px !important;
}
/* .collspse {
  position: absolute;
  background-color: #324157;
  color:#fff;
  width: 20px;
  height: 20px;
  cursor: pointer;
} */
</style>