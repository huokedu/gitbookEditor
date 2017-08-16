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
      <el-button @click="addArticle">添加文章</el-button> 
    </div>
    <draggable class="article" element="div" v-model="collection" :options="dragOptions"> 
      <transition-group type="transition" name="el-fade-in">
        <li class="col" v-for="(col, index) of collection" :class="{selected: selected[index]}" :key="col" @click="makeSelected(index)"> 
          <span :title="col">
            {{col}}
          </span>
          <i class="el-icon-delete2" title="删除文档" @click="delArticle(index)"></i>
        </li> 
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import {Icon, Button, Dropdown, DropdownMenu, DropdownItem, MessageBox, Message} from 'element-ui'
import draggable from 'vuedraggable'
export default {
  name: 'document_search',
  data () {
    return {
      collection: ['fasdf', 'asdfasdf', '你是大厦发斯蒂芬'],
      editable: true,
      selected: []
    }
  },
  mounted () {
    let vm = this
    vm.selected.length = vm.collection.length
  },
  methods: {
    delArticle (index) {
      let vm = this
      MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.collection.splice(index, 1)
        Message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addArticle () {
      let vm = this
      MessageBox.prompt('请输入文档名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\S]/,
        inputErrorMessage: '文档名不能为空'
      }).then(({ value }) => {
        vm.collection.splice(vm.collection.length, 1, value)
        Message({
          type: 'success',
          message: '添加成功'
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    makeSelected (index) {
      let vm = this
      vm.selected.length = vm.collection.length
      vm.selected = vm.selected.map(() => false)
      vm.selected.splice(index, 1, true)
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
#docSearch .el-icon-d-caret:hover, #docSearch button:hover{
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
  cursor: pointer;
}
#docSearch .article li>span{
  display: inline-block;
  width: 160px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;
}
#docSearch .article li:hover, #docSearch .selected {
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