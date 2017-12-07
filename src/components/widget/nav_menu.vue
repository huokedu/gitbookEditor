<template>
<div class="wrapper">
  <el-menu :default-active="activeRoute" class="el-menu-vertical-demo el-icon-" theme="dark" 
  @select=changeView :unique-opened="true" :collapse="isCollapse">
  <el-menu-item index="/" v-if="power.has('general/data/query')">
      <i class="fa fa-home" aria-hidden="true"></i>
      <span slot="title">首页</span>
  </el-menu-item>

  <el-submenu index="项目" v-if="power.has('project/query') || power.has('project/add') || power.has('project/tag/list')">
    <template slot="title">
      <i class="fa fa-th" aria-hidden="true"></i>
      <span slot="title">项目</span>
    </template>
    <el-menu-item index="/repo/repo_list" v-if="power.has('project/query')">项目列表</el-menu-item>
    <el-menu-item index="/repo/repo_add" v-if="power.has('project/add')">添加项目</el-menu-item>
    <el-menu-item index="/repo/tag" v-if="power.has('project/tag/list')">标签</el-menu-item>    
  </el-submenu>

  <el-submenu index="文档" v-if="power.has('article/list') || power.has('sort/list')">
    <template slot="title">
      <i class="fa fa-book" aria-hidden="true"></i>
      <span slot="title">技术文档</span>
    </template>
    <el-menu-item index="/tech_list/list" v-if="power.has('article/list')">文档列表</el-menu-item>
    <el-menu-item index="/tech_list/add" v-if="power.has('sort/list') && power.has('article/list')">添加文档</el-menu-item>
  </el-submenu>

  <el-menu-item index="/order/order_list" v-if="power.has('order/query')">
    <i class="fa fa-wpforms" aria-hidden="true"></i>
    <span slot="title">订单</span>
  </el-menu-item>

  <el-menu-item index="/comment/comment_list" v-if="power.has('project/comment/query')">
    <i class="fa fa-comment" aria-hidden="true"></i>
    <span slot="title">评论</span>
  </el-menu-item>

  <el-menu-item index="/cdKey" v-if="power.has('account/share/query')">
      <i class="fa fa-exchange" aria-hidden="true"></i>
      <span slot="title">兑换码</span>
  </el-menu-item>

  <el-menu-item index="/member/member_list" v-if="power.has('member/list')">
      <i class="fa fa-user" aria-hidden="true"></i>
      <span slot="title">会员</span>
  </el-menu-item>

  <el-menu-item index="/power" v-if="power.has('power/admin/list') && power.has('member/list')">
      <i class="fa fa-superpowers" aria-hidden="true"></i>
      <span slot="title">管理员</span>
  </el-menu-item>

  <el-submenu index="stastics" v-if="power.has('income/statistics/query') || power.has('member/router/query') || power.has('ip/query')">
    <template slot="title">
      <i class="fa fa-bar-chart" aria-hidden="true"></i>
      <span slot="title">经营数据</span>
    </template>
    <el-menu-item index="/statistics/incoming_statistics" v-if="power.has('income/statistics/query')">收入统计</el-menu-item>
    <el-menu-item index="/statistics/api_statistics"  v-if="power.has('member/router/query')">接口调用统计</el-menu-item>
    <el-menu-item index="/statistics/ip_statistics" v-if="power.has('ip/query')">IP统计</el-menu-item>
    <!-- <el-menu-item index="8-4">调用日志</el-menu-item> -->
  </el-submenu>
  
  <el-submenu index="9" v-if="power.has('member/list') || power.has('project/comment/query')">
    <template slot="title">
      <i class="fa fa-snapchat-ghost" aria-hidden="true"></i>
      <span slot="title">影子</span>
    </template>
    <el-menu-item index="/shadow/member_list" v-if="power.has('member/list')">用户列表</el-menu-item>
    <el-menu-item index="/shadow/project_list" v-if="power.has('project/query')">项目列表</el-menu-item>
    <el-menu-item index="/shadow/comment_list" v-if="power.has('project/comment/query')">评论列表</el-menu-item>
  </el-submenu>
  <!-- <el-menu-item index="/customer" v-if="power.has('customer/session/query')">
      <i class="el-icon-message" ></i>
      <span slot="title">客服</span>
  </el-menu-item> -->
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
    },
    power () {
      return new Set(this.$store.state.power.powerList)
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
    z-index: 3000;
    overflow: hidden;
    transition: all .28s ease-out;
    transform: translate(-160px,0);  
}
.wrapper .fa {
  width: 16px;
  font-size: 16px;
  margin-right: 10px;
  vertical-align: middle;
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