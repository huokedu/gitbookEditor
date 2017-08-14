<template>
  <div id="docSearch">
    <div class="header">
      <div class="search">
        <i class="el-icon-search"></i>
        <input type="text"　placeholder="搜索">
      </div>
      <el-dropdown menu-align="start">
        <span class="el-dropdown-link">
          <i class="el-icon-d-caret" title="排序"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>创建时间</el-dropdown-item>
          <el-dropdown-item>更新时间</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button>添加文章</el-button> 
    </div>
    <div class="article">
      <p>fasdkfjasdklf
        <i class="el-icon-delete2"></i>
      </p>
      <p>
        <span>
          附近的斯科拉法爱撒打开了房间爱撒打开了房间按时打卡了；发按时打卡了就；放假按时打卡里飞非非烦死哒
        </span><i class="el-icon-delete2"></i></p>
      <p>fasdkfjasdklf</p>
      <p>fasdkfjasdklf</p>
      
    </div>
  </div>
</template>

<script>
import {Icon, Button, Dropdown, DropdownMenu, DropdownItem} from 'element-ui'
export default {
  name: 'document_search',
  components: {
    Icon,
    elButton: Button,
    elDropdown: Dropdown,
    elDropdownMenu: DropdownMenu,
    elDropdownItem: DropdownItem
  }
}
</script>

<style scoped>
#docSearch {
  float: left;
  width: 220px;
  height: 888px;
  text-align: center;
  border-bottom: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
}
#docSearch .header {
  padding: 20px 0;
}
#docSearch .search{
  display: inline-block;
  padding: 2px 6px;
  font-size: 14px;
  border: 1px solid #515151;
  border-radius: 2px;
  color: #515151;
}
#docSearch input {
  border: none;
  outline: none;
  width: 60px;
}
#docSearch h2{
  font-size: 24px;
  margin-left: -10px;
  cursor: pointer;
}
#docSearch .el-icon-d-caret{
  font-size: 18px;
  color:#515151;
  margin: 0 5px 0 15px;
  cursor: pointer;
}
#docSearch button {
  font-size: 14px;
  padding: 6px;
}
#docSearch .el-icon-d-caret:hover, #docSearch button:hover {
  color: #f63;
  border-color: #f63;
}
#docSearch .article p{
  margin: 0;
  padding:15px 10px;
  font-size: 18px;
  text-align: left;
  cursor: pointer;
}
#docSearch .article span{
  display: inline-block;
  width: 160px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;
}
#docSearch .article p:hover{
  color: #fff;
  background-color: #f63;
}
#docSearch .article .el-icon-delete2{
  float: right;
  margin-top: 1px;
  color: #fff;
}
</style>