<template>
  <div id="listCol">
    <h2 @click="addSort"><i class="el-icon-plus"></i>&nbsp;&nbsp;新分类</h2>
    <h2></h2>
    <draggable class="collection" element="div" :options="dragOptions" @sort="changeSort">
       <span class="col" v-for="(col,index) of collection" :class="{selected: selected[index]}" :key="col._id" @click="makeSelected(index, col._id)">
        <span  :data-id="col._id":title="col.name" :contenteditable="editable[index]" @blur="changeSortName">
          {{col.name}}        
        </span>
        <i class="el-icon-delete2" title="删除分类"　@click="delSort(index)"></i>        
      </span>
    </draggable>
    <div class="recycle" :class="[{selected: isRecycle}, '']" title="删除分类"　@click="getRecycle" v-if="power.has('recycle/list')">
      <i class="el-icon-delete2"></i>
      <span>回收站</span>
    </div>
  </div>
</template>

<script>
import { getSort, addSort, delSort, editSort } from '../../api/articles.js'
import draggable from 'vuedraggable'
export default {
  name: 'list_collection',
  data () {
    return {
      collection: [],
      selected: [],
      selectedIndex: 0,
      editable: []
    }
  },
  mounted () {
    const vm = this
    if (!vm.$route.query._id && vm.power.has('sort/list')) vm.getSort()
  },
  methods: {
    getSort () {
      // 获取文章分类列表
      const vm = this
      getSort().then(res => {
        if (res.data.status === 200) {
          vm.collection = res.data.data.sorts
          if (vm.$route.query._id) {
            vm.collection.some((sort, index) => {
              // 返回第一个分类id相等的分类
              if (sort._id === vm.article.sort) {
                vm.makeSelected(index, sort._id)
                return true
              }
            })
          } else {
            vm.makeSelected(0, vm.collection[0]._id)
          }
        }
      })
    },
    delSort (index) {
      // 删除文章分类
      let vm = this
      vm.$msgbox.confirm('此操作将删除该分类下所有文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSort(vm.$store.state.article.sort)
        .then(res => {
          if (res.data.status === 200) {
            vm.collection.splice(index, 1)
            vm.makeSelected(0, res.data.data.sorts[0]._id)
          }
          vm.$message({
            type: 'success',
            message: res.data.message
          })
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    makeSelected (index, id) {
      // 选中状态
      let vm = this
      vm.$store.dispatch('article/getStatus', false)
      vm.selected = vm.editable = []
      vm.selected.length = vm.editable.length = vm.collection.length
      vm.selectedIndex = index
      vm.selected.splice(index, 1, true)
      vm.editable.splice(index, 1, true)
      vm.$store.dispatch('article/getSort', id)
    },
    addSort () {
      // 添加新分类
      let vm = this
      vm.$msgbox.prompt('请输入分类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\D/,
        inputErrorMessage: '分类名不能有数字'
      }).then(({ value }) => {
        addSort(value).then(res => {
          if (res.data.status === 200) {
            vm.collection.splice(vm.collection.length, 1, res.data.data)
          }
          vm.$message({
            type: 'success',
            message: res.data.message
          })
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    getRecycle () {
      const vm = this
      vm.selected.splice(vm.selectedIndex, 1, false)
      vm.$store.dispatch('article/getStatus', 'List')
    },
    // 编辑分类名称
    changeSortName (event) {
      const name = event.target.innerText
      if (name === event.target.title) return
      const vm = this
      if (!/\D/.test(name)) {
        event.target.innerText = event.target.title
        return vm.$message({
          type: 'success',
          message: '分类名不能有数字'
        })
      }
      console.log(name, event.target.title)
      const id = event.target.dataset.id
      editSort({id, name}).then(res => {
        if (res.data.status === 200) {
          event.target.title = name
          vm.$message({
            type: 'success',
            message: res.data.message
          })
        }
      })
    },
    changeSort (event) {
      const index = event.newIndex - 1
      const vm = this
      if (index < 0) return
      // 获取离开和进入分类id和文章id
      const toId = event.srcElement.children[index].firstChild.dataset.id
      const fromId = vm.$store.state.article.sort
      if (fromId === toId) return
      const articleId = event.item.dataset.id
      const delIndex = event.item.dataset.index
      // 调用编辑接口
      editSort({fromId, toId, articleId}).then(res => {
        if (res.data.status === 200) {
          vm.$store.commit('article/CHANGE_LIST', delIndex)
          vm.$message({
            type: 'success',
            message: res.data.message
          })
        }
      })
    }
  },
  computed: {
    isRecycle () {
      return this.$store.state.article.status
    },
    article () {
      return this.$store.state.article.article
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    },
    dragOptions () {
      return {
        animation: 1,
        group: {
          name: 'levelTwo',
          pull: false,
          put: true
        },
        filter: 'span',
        preventOnFilter: false,
        disabled: false
      }
    }
  },
  watch: {
    article (article, val) {
      const vm = this
      if (!vm.$route.query._id || !vm.power.has('sort/list')) return
      vm.getSort()
    }
  },
  components: {
    draggable
  },
  beforeDestroy () {
    const vm = this
    vm.$store.dispatch('article/getSort', '')
  }
}
</script>

<style scoped>
#listCol {
  position: relative;
  float: left;
  width: 180px;
  height: 889px;
  color: #fff;
  background-color: rgba(255,102,51, .7);
  text-align: center;
  overflow: auto;
}
#listCol h2{
  font-size: 24px;
  margin-left: -10px;
  cursor: pointer;
}
#listCol .col {
  display: block;
  padding: 0 12px;
  font-size: 20px;    
  line-height: 45px;
  text-align: left;
  cursor: pointer;
}
#listCol .col span{
  display: inline-block;
  width: 120px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;  
}
#listCol .col:hover, #listCol .selected, #listCol .recycle:hover {
  color: #f63;
  background-color: #fff !important;
}
#listCol .col .el-icon-delete2, #listCol .col .el-icon-plus{
  float: right;
  margin: 14px 0 0 6px;
  color: rgba(255,147,111, 1);
}
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
#listCol .recycle {
  position: fixed;
  bottom: 0;
  left: 40px;
  width: 180px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  background-color: rgba(255,102,51, .7);
}
</style>