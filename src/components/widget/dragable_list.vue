<template>
  <div id="dragCol">
    <h2 @click="addTitle"><i class="el-icon-plus"></i>&nbsp;&nbsp;新标题</h2>
    <draggable class="wrapper" element="div" v-model="collection" :options="dragOptions"> 
        <li class="col" v-for="(col, index) of collection" :key="col.pri_dir"> 
          <p class="level-one" :title="col.pri_dir">
            <span>{{col.pri_dir}}</span>
            <i class="el-icon-delete2" title="删除目录" @click="delTitle(index)"></i>        
            <!-- <i class="el-icon-plus" title="添加文档"　@click="addArticle(collection[index])"></i>       -->
          </p>
          <el-collapse-transition>
            <draggable element="div" v-model="collection[index].sec_dir" :options="dragOptions1" v-show="!show[index]"> 
              <transition-group type="transition" :name="'flip-list'">
                <li class="level-two" v-for="(co, index1) of collection[index].sec_dir" :key="co._id"  :ref="index + '' + index1" @click="makeSelected(index + '' + index1, co)">
                  <span :title="co.title">
                    {{co.title}}        
                  </span>
                  <i class="el-icon-delete2" title="删除文章" @click="delArticle(index, index1)"></i> 
                </li> 
              </transition-group>
            </draggable>
          </el-collapse-transition>
        </li> 
    </draggable>
  </div>
</template>

<script>
import {Icon, MessageBox, Message} from 'element-ui'
import draggable from 'vuedraggable'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import { getBook } from '../../js/axios.js'

import { mapState } from 'vuex'
export default {
  name: 'list-collection',
  data () {
    return {
      collection: [],
      editable: true,
      show: []
    }
  },
  mounted () {
    const vm = this
    vm.getDir('599d52cf433770613ba10f3e')
  },
  methods: {
    // 获取目录
    getDir (id) {
      let vm = this
      getBook(id)
      .then((res) => {
        if (res.data.status === 200) {
          if (!res.data.data.pub) return
          vm.collection = res.data.data.pub.directory
          vm.$store.dispatch('article/getAPITitle', res.data.data.pub.title)
        }
      })
    },
    delTitle (index) {
      let vm = this
      MessageBox.confirm('此操作将删除该目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.collection.splice(index, 1)
        Message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((err) => {
        console.log(err)
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    makeSelected (key, article) {
      let vm = this
      Object.keys(vm.$refs).map(ele => {
        if (!vm.$refs[ele][0]) return
        vm.$refs[ele][0].classList.remove('selected')
      })
      if (key < 0) return
      vm.$refs[key][0].classList.add('selected')
      article.status = true
      vm.$store.dispatch('article/changeSelected', article)
    },
    addTitle () {
      let vm = this
      MessageBox.prompt('请输入目录名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\D/,
        inputErrorMessage: '标题名不能有数字'
      }).then(({ value }) => {
        vm.collection.splice(vm.collection.length, 1, { pri_dir: value, sec_dir: [] })
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
    // addArticle (key) {
    //   let vm = this
    //   MessageBox.prompt('请输入文档名称', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /[\S]/,
    //     inputErrorMessage: '文档名不能为空'
    //   }).then(({ value }) => {
    //     vm.collection1[key].splice(vm.collection1[key].length, 1, value)
    //     Message({
    //       type: 'success',
    //       message: '添加成功'
    //     })
    //   }).catch(() => {
    //     Message({
    //       type: 'info',
    //       message: '取消输入'
    //     })
    //   })
    // },
    delArticle (key, index) {
      let vm = this
      MessageBox.confirm('此操作将从目录下删除该文档, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.collection[key].sec_dir.splice(index, 1)
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
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: 'levelOne',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    dragOptions1 () {
      return {
        animation: 0,
        group: 'levelTwo',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    ...mapState('article', [
      'title', 'chooseDir', 'article'
    ])
  },
  watch: {
    title (title) {
      const vm = this
      vm.collection.map((dir, index) => {
        dir.sec_dir.map((seDir, index1) => {
          if (seDir._id === vm.article._id) {
            const article = {}
            article._id = vm.collection[index].sec_dir[index1]._id
            article.title = title
            vm.collection[index].sec_dir.splice(index1, 1, article)
          }
        })
      })
    },
    chooseDir (val) {
      if (!val) this.makeSelected(-1)
    },
    collection (val) {
      const vm = this
      const arr = val.concat()
      vm.$store.dispatch('article/getDir', arr)
    }
  },
  components: {
    Icon,
    draggable,
    elCollapseTransition: CollapseTransition
  }
}
</script>

<style scoped>
#dragCol {
  float: left;
  width: 180px;
  height: 889px;
  color: #fff;
  background-color: rgba(255,102,51, .7);
  text-align: center;
  overflow: auto;
}
#dragCol h2{
  font-size: 24px;
  margin-left: -10px;
  cursor: pointer;
}
#dragCol .col {
  font-size: 20px;
  line-height: 45px;
  text-align: left;
}
#dragCol .level-one {
  margin: 0;
  padding: 0 5px 0 15px; 
}
 #dragCol .level-one + div > span{
  display: inline-block;
  min-height: 25px;
  width: 100%;
  overflow: hidden;
} 
#dragCol .level-one>span, #dragCol .level-two>span{
  display: inline-block;
  text-indent: 0;
  width: 108px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;
  cursor: move;
}
#dragCol .level-two{
  padding-right: 5px;
}
#dragCol .level-two>span{
  text-indent: 35px;
  width: 145px;
}
#dragCol .level-two:hover, #dragCol .selected{
  color: #f63;
  background-color: #fff;
}
#docSearch .sortable-chose {
  width: 20px !important;
}
#dragCol .col .el-icon-delete2, #dragCol .col .el-icon-plus{
  float: right;
  margin: 14px 0 0 6px;
  cursor: pointer;
}
#dragCol .level-two .el-icon-delete2{
  color: rgba(255, 147, 111, 1);
}
.flip-list-move {
  transition: transform 0.5s;
}
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
</style>