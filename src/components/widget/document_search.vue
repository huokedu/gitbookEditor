<template>
  <div id="docSearch">
    <div class="header">
      <div class="search">
        <i class="el-icon-search"></i>
        <input type="text"　placeholder="搜索" v-model="keyword" @keyup="search">
      </div>
      <el-dropdown menu-align="start">
        <span class="el-dropdown-link">
          <i class="el-icon-d-caret" title="排序"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changeOrder('create_time')">创建时间</el-dropdown-item>
          <el-dropdown-item @click.native="changeOrder('update_time')">更新时间</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="addArticle">添加文章</el-button> 
    </div>
    <draggable class="article" element="div" v-model="collection" :options="dragOptions"> 
      <transition-group type="transition" name="el-fade-in">
        <li class="col" v-for="(col, index) of collection" :class="{selected: selected[index]}" :key="col._id" @click="makeSelected(index, col)"> 
          <span :title="col.title">
            {{col.title}}
          </span>
          <i class="el-icon-delete2" title="删除文档" @click.stop="delArticle(index, col)"></i>
        </li> 
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import {Icon, Button, Dropdown, DropdownMenu, DropdownItem, MessageBox, Message} from 'element-ui'
import draggable from 'vuedraggable'
import { getAPIDoc, delDoc, addDoc } from '../../js/axios.js'
export default {
  name: 'document_search',
  props: ['label'],
  data () {
    return {
      collection: [],
      editable: true,
      selected: [],
      selectedIndex: 0,
      keyword: '',
      order: 1
    }
  },
  mounted () {
    let vm = this
    vm.selected.length = vm.collection.length
    // 判断文档类型查询文档
    if (vm.label === 'API') vm.getArticles(1, vm.label)
  },
  methods: {
    getArticles (page) {
      let vm = this
      getAPIDoc({ page }).then((res) => {
        if (res.data.status === 200) vm.collection = res.data.data
        vm.makeSelected(0, res.data.data[0])
      })
    },
    delArticle (index, article) {
      let vm = this
      MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDoc(article._id).then((res) => {
          if (res.data.status === 200) {
            vm.collection.splice(index, 1)
            if (vm.selected[index]) {
              vm.makeSelected(0, vm.collection[0])
            } else {
              vm.selected.splice(index, 1)
            }
            Message({
              type: 'success',
              message: '删除成功!'
            })
          }
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
        addDoc({title: value}).then((res) => {
          if (res.data.status === 200) {
            vm.collection.splice(0, 0, res.data.data)
            vm.makeSelected(0, res.data.data)
            Message({
              type: 'success',
              message: '添加成功'
            })
          }
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    makeSelected (index, article) {
      let vm = this
      vm.selected.length = vm.collection.length
      vm.selected = vm.selected.map(() => false)
      if (index < 0) return
      vm.selected.splice(index, 1, true)
      vm.selectedIndex = index
      article.status = false
      vm.$store.dispatch('article/changeSelected', article)
    },
    search () {
      let vm = this
      getAPIDoc({page: 1, title: vm.keyword}).then((res) => {
        if (res.data.status === 200) vm.collection = res.data.data
      })
    },
    changeOrder (index) {
      let vm = this
      const order = {}
      order[index] = vm.order
      vm.order = vm.order === 1 ? -1 : 1
      getAPIDoc({page: 1, title: vm.keyword, order}).then((res) => {
        if (res.data.status === 200) vm.collection = res.data.data
      })
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
    },
    title () {
      return this.$store.state.article.title
    },
    checkChoose () {
      return this.$store.state.article.chooseDir
    },
    sort () {
      return this.$store.state.article.sort
    }
  },
  watch: {
    title (val) {
      const vm = this
      vm.collection[vm.selectedIndex].title = val
    },
    checkChoose (val) {
      if (val) this.makeSelected(-1)
    },
    sort (sort) {
      const vm = this
      getAPIDoc({page: 1, label: vm.label, sort}).then((res) => {
        if (res.data.status === 200) vm.collection = res.data.data
        vm.makeSelected(0, res.data.data[0])
      })
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
  position: relative;
  height: 820px;
  overflow: auto;    
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
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
.el-fade-in-leave-active {
  display: none;
}
</style>