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
    <draggable class="article" element="div" v-model="collection" :options="dragOptions"> 
      <transition-group type="transition" name="el-fade-in">
        <li class="col" v-for="(col, index) of collection" :key="col" @click="delArticle(index)"> 
          <span :title="col">
            {{col}}
          </span>
          <i class="el-icon-delete2" title="删除文档"></i>
        </li> 
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import {Icon, Button, Dropdown, DropdownMenu, DropdownItem} from 'element-ui'
import draggable from 'vuedraggable'
export default {
  name: 'document_search',
  data () {
    return {
      collection: ['fasdf', 'asdfasdf', '你是大厦发斯蒂芬'],
      editable: true
    }
  },
  methods: {
    delArticle (index) {
      this.collection.splice(index, 1)
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: { name: 'levelTwo', pull: 'clone', put: false },
        disabled: !this.editable,
        ghostClass: 'ghost',
        sort: false
      }
    }
  },
  components: {
    Icon,
    elButton: Button,
    elDropdown: Dropdown,
    elDropdownMenu: DropdownMenu,
    elDropdownItem: DropdownItem,
    draggable
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
#docSearch .article {
  min-height: 600px;
}
#docSearch .article li{
  margin: 0;
  padding:15px 10px;
  font-size: 18px;
  text-align: left;
  cursor: move;
}
#docSearch .article li>span{
  display: inline-block;
  width: 160px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;
}
#docSearch .article li:hover{
  color: #fff;
  background-color: #f63;
}
#docSearch .article .el-icon-delete2{
  float: right;
  margin-top: 1px;
  color: #fff;
  cursor: pointer;
}
#docSearch .ghost {
  opacity: 0.5;
}
#dragCol .sortable-chosen>span{
  display: inline-block;
  text-indent: 0;
  overflow:hidden;
  text-indent: 35px;
  width: 145px;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;
}
</style>