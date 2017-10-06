<template>
  <div id="docSearch">
    <div class="header">
      <div class="search">
        <i class="el-icon-search"></i>
        <input type="text"　placeholder="搜索" v-model="keyword" @keyup="search">
      </div>
      <el-dropdown menu-align="start" @command="changeOrder">
        <span class="el-dropdown-link">
          <i class="el-icon-d-caret" title="排序"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item　command="create_time">创建时间</el-dropdown-item>
          <el-dropdown-item v-if="!isRecycle" command="update_time">更新时间</el-dropdown-item>
          <el-dropdown-item v-else command="delete_time">删除时间</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="addArticle" v-show="!isRecycle && power.has('article/add')">添加文章</el-button>
      <el-button @click="getArticles" v-show="isRecycle === 'API'">返回API</el-button> 
    </div>
    <draggable class="article" element="div" v-model="list" :options="dragOptions" :move="onMove" >
      <transition-group type="transition" name="el-fade-in">
        <li :data-id="col._id" :data-index="index" class="col" v-for="(col, index) of list" :class="{selected: selected[index]}" :key="col._id" @click="makeSelected(index, col)"> 
          <span :title="col.title">
            {{col.title}}
          </span>
          <i class="el-icon-delete2" title="删除文档" @click.stop="delArticle(index, col)" v-if="!isRecycle && power.has('article/del')"></i>
        </li> 
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getAPIDoc, delDoc, addDoc, getRecycleList } from '../../api/articles.js'
import { mapState } from 'vuex'
export default {
  name: 'document_search',
  props: ['label'],
  data () {
    return {
      editable: true,
      selected: [],
      keyword: '',
      order: 1,
      secDir: []
    }
  },
  mounted () {
    let vm = this
    vm.selected.length = vm.list.length
    // 判断文档类型查询文档
    if (vm.label === 'API') vm.getArticles(1, vm.label)
  },
  methods: {
    getArticles (page) {
      let vm = this
      vm.$store.dispatch('article/getStatus', false)
      const sort = vm.sort || vm.$route.query.API_id
      getAPIDoc({ page, sort }).then((res) => {
        if (res.data.status === 200) vm.$store.commit('article/GET_LIST', res.data.data)
        vm.makeSelected(0, res.data.data[0])
      })
    },
    delArticle (index, article) {
      let vm = this
      vm.$msgbox.confirm('删除文档到回收站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDoc(article._id).then((res) => {
          if (res.data.status === 200) {
            vm.$store.commit('article/CHANGE_LIST', index)
            if (vm.selected[index]) {
              vm.makeSelected(0, vm.list[0])
            } else {
              vm.selected.splice(index, 1)
            }
            vm.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addArticle () {
      let vm = this
      vm.$msgbox.prompt('请输入文档名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\S]/,
        inputErrorMessage: '文档名不能为空'
      }).then(({ value }) => {
        const sort = vm.sort || vm.$route.query.API_id
        addDoc({title: value, sort, label: vm.label, token: vm.$store.state.power.token}).then((res) => {
          if (res.data.status === 200) {
            vm.$store.commit('article/ADD_LIST', res.data.data)
            vm.makeSelected(0, res.data.data)
            vm.$message({
              type: 'success',
              message: '添加成功'
            })
          } else {
            vm.$message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    makeSelected (index, article) {
      let vm = this
      vm.selected = []
      vm.selected.length = vm.list.length
      if (index < 0) return
      vm.selected.splice(index, 1, true)
      vm.$store.commit('article/GET_SELECTED', index)
      if (!article) return
      article.status = false
      vm.$store.dispatch('article/changeSelected', article)
    },
    search () {
      let vm = this
      if (vm.isRecycle) {
        const vm = this
        getRecycleList({ label: vm.isRecycle, title: vm.keyword })
        .then(res => {
          vm.$store.commit('article/GET_LIST', res.data.data.docs)
          vm.makeSelected(0, res.data.data.docs[0])
        })
      } else {
        getAPIDoc({page: 1, title: vm.keyword, label: vm.label, sort: vm.sort}).then((res) => {
          if (res.data.status === 200) vm.$store.commit('article/GET_LIST', res.data.data)
        })
      }
    },
    changeOrder (index) {
      let vm = this
      const order = {}
      order[index] = vm.order
      vm.order = vm.order === 1 ? -1 : 1
      if (!vm.isRecycle) {
        const sort = vm.sort || vm.$route.query.API_id
        getAPIDoc({page: 1, title: vm.keyword, order, label: vm.label, sort}).then((res) => {
          if (res.data.status === 200) vm.$store.commit('article/GET_LIST', res.data.data)
        })
      } else {
        getRecycleList({ label: vm.isRecycle, order })
        .then(res => {
          vm.$store.commit('article/GET_LIST', res.data.data.docs)
          vm.makeSelected(0, res.data.data.docs[0])
        })
      }
    },
    // 判断重复
    onMove ({draggedContext}) {
      const id = draggedContext.element._id
      const vm = this
      let duplicate = false
      const checkSet = new Set()
      checkSet.add(id)
      Object.values(vm.$store.state.article.levelTwo).map(dir => {
        if (duplicate) return
        duplicate = dir.some((article, index) => {
          if (checkSet.has(article._id)) return true
          checkSet.add(article._id)
        })
      })
      return !duplicate
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
    ...mapState('article', [
      'chooseDir', 'sort', 'isRecycle', 'list', 'selectedIndex'
    ]),
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  watch: {
    chooseDir (val) {
      if (val) this.makeSelected(-1)
    },
    sort (sort) {
      const vm = this
      if (sort === undefined) return
      getAPIDoc({page: 1, label: vm.label, sort}).then((res) => {
        if (res.data.status === 200) {
          vm.$store.commit('article/GET_LIST', res.data.data)
          // 判断编辑文章时选中状态
          if (vm.$route.query._id) {
            vm.selected.length = vm.list.length
            res.data.data.map((article, index) => {
              if (article._id === vm.$route.query._id) {
                vm.selected.splice(index, 1, true)
              }
            })
          } else {
            vm.makeSelected(0, res.data.data[0])
          }
        }
      })
    },
    isRecycle (status) {
      // 回收站列表
      if (status) {
        const vm = this
        getRecycleList({label: status, sort: vm.$route.query.API_id})
        .then(res => {
          vm.$store.commit('article/GET_LIST', res.data.data.docs)
          vm.makeSelected(0, res.data.data.docs[0])
        })
      } else {
        // 文章列表
        const vm = this
        const sort = vm.sort || vm.$route.query.API_id
        getAPIDoc({page: 1, label: vm.label, sort}).then((res) => {
          if (res.data.status === 200) vm.$store.commit('article/GET_LIST', res.data.data)
          vm.makeSelected(0, res.data.data[0])
        })
      }
    },
    selectedIndex (index) {
      const vm = this
      if (!this.isRecycle) return
      vm.makeSelected(index)
    }
  },
  components: {
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