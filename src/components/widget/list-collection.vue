<template>
  <div id="listCol">
    <h2 @click="addSort"><i class="el-icon-plus"></i>&nbsp;&nbsp;新分类</h2>
    <div class="collection">
       <span class="col" v-for="(col,index) of collection" :class="{selected: selected[index]}" :key="col._id" @click="makeSelected(index, col._id)">
        <span :title="col.name">
          {{col.name}}        
        </span>
        <i class="el-icon-delete2" title="删除分类"　@click="delSort(index)"></i>        
      </span>
    </div>
  </div>
</template>

<script>
import {Icon, MessageBox, Message} from 'element-ui'
import { getSort, addSort, delSort } from '../../js/axios.js'
export default {
  name: 'list-collection',
  data () {
    return {
      collection: [],
      selected: []
    }
  },
  mounted () {
    let vm = this
    vm.getSort()
  },
  methods: {
    getSort () {
      const vm = this
      getSort().then(res => {
        if (res.data.status === 200) {
          vm.collection = res.data.data.sorts
          vm.selected.length = vm.collection.length
          vm.makeSelected(0, res.data.data.sorts[0]._id)
        }
      })
    },
    delSort (index) {
      let vm = this
      MessageBox.confirm('此操作将删除该分类下所有文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSort(vm.$store.state.article.sort)
        .then(res => {
          if (res.data.status === 200) {
            vm.collection.splice(index, 1)
            vm.makeSelected(0, vm.collection[0]._id)
          }
          Message({
            type: 'success',
            message: res.data.message
          })
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    makeSelected (index, id) {
      let vm = this
      vm.selected.length = vm.collection.length
      vm.selected = vm.selected.map(() => false)
      vm.selected.splice(index, 1, true)
      vm.$store.dispatch('article/getSort', id)
    },
    addSort () {
      let vm = this
      MessageBox.prompt('请输入分类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\D/,
        inputErrorMessage: '分类名不能有数字'
      }).then(({ value }) => {
        addSort(value).then(res => {
          if (res.data.status === 200) {
            vm.collection.splice(vm.collection.length, 1, res.data.data)
          }
          Message({
            type: 'success',
            message: res.data.message
          })
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  },
  components: {
    Icon
  }
}
</script>

<style scoped>
#listCol {
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
#listCol .col:hover, #listCol .selected{
  color: #f63;
  background-color: #fff;
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
</style>