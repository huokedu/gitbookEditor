<template>
  <div id="APIPlusDocument">
    <nav-bar></nav-bar>
    <div class="main-content">
      <nav-title></nav-title>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import navBar from './components/widget/nav_menu'
import navTitle from './components/widget/nav_title'
export default {
  name: 'app',
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
