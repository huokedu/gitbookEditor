<template>
  <div id="dragCol">
    <h2 @click="addDir"><i class="el-icon-plus"></i>&nbsp;&nbsp;新标题</h2>
    <draggable class="wrapper" element="div" v-model="levelOne" :options="dragOptions"> 
        <li class="col" v-for="(col, index) of levelOne" :key="col"> 
          <p class="level-one" :title="col">
            <span>{{col}}</span>
            <i class="el-icon-delete2" title="删除目录" @click="delDir(index)"></i>        
            <!-- <i class="el-icon-plus" title="添加文档"　@click="addArticle(levelOne[index])"></i>       -->
          </p>
          <el-collapse-transition>
            <draggable element="div" v-model="levelTwo[col]" :options="dragOptions1" @sort="saveDir"> 
              <transition-group type="transition" :name="'flip-list'">
                <li class="level-two" v-for="(co, index1) of levelTwo[col]" 
                :key="co._id"  
                :ref="index + '-' + index1"
                @click="makeSelected(index + '-' + index1, co)"
                >
                  <span :title="co.title">
                    {{co.title}}        
                  </span>
                  <i class="el-icon-delete2" title="删除文章" @click="delArticle(col, index1)"></i> 
                </li> 
              </transition-group>
            </draggable>
          </el-collapse-transition>
        </li>
        <div :class="[{selected: isRecycle}, 'recycle']" title="删除分类"　@click="getRecycle" v-if="power.has('recycle/list') && $route.path !== '/repo/pepo_edit/list'">
          <i class="el-icon-delete2"></i>
          <span>回收站</span>
        </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import { getBook } from '../../api/articles.js'

import { mapState } from 'vuex'
export default {
  name: 'list-collection',
  data () {
    return {
      editable: true,
      levelTwo: {}
    }
  },
  mounted () {
    const vm = this
    vm.getDir(vm.$route.query.API_id)
  },
  methods: {
    // 获取目录
    getDir (id) {
      let vm = this
      getBook(id)
      .then((res) => {
        if (res.data.status === 200) {
          if (!res.data.data.pub) return
          const levelTwo = {}
          const levelOne = res.data.data.pub.directory.map((dir, index) => {
            levelTwo[dir.pri_dir] = []
            dir.sec_dir.map((seDir) => {
              levelTwo[dir.pri_dir].push(seDir._id)
            })
            return dir.pri_dir
          })
          vm.$store.dispatch('article/getDir', {levelOne})
          vm.levelTwo = levelTwo
          vm.saveDir()
          vm.$store.dispatch('article/getAPITitle', res.data.data.pub.title)
        }
      })
    },
    delDir (index) {
      // 删除目录
      let vm = this
      vm.$msgbox.confirm('此操作将删除该目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.$store.dispatch('article/modifyDir', { index })
        vm.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((err) => {
        console.log(err)
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    makeSelected (key, article) {
      // 选中状态
      let vm = this
      // 取消所有选中状态
      Object.keys(vm.$refs).map(key => {
        if (vm.$refs[key].length === 0) return
        vm.$refs[key][0].classList.remove('selected')
      })
      if (key < 0) return
      vm.$refs[key][0].classList.add('selected')
      article.status = true
      vm.$store.dispatch('article/changeSelected', article)
    },
    addDir () {
      // 添加目录
      let vm = this
      vm.$msgbox.prompt('请输入目录名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\D/,
        inputErrorMessage: '标题名不能有数字'
      }).then(({ value }) => {
        const dulpliate = vm.levelOne.some(dir => {
          return dir === value
        })
        const message = dulpliate ? '标题重复' : '添加成功'
        const type = dulpliate ? 'warning' : 'success'
        vm.$message({
          type, message
        })
        if (dulpliate) return vm.addDir()
        vm.$set(vm.levelTwo, value, [])
        vm.$store.dispatch('article/modifyDir', { index: vm.levelOne.length, title: value })
      }).catch((err) => {
        console.log(err)
        vm.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    delArticle (key, index) {
      // 删除二级目录
      let vm = this
      vm.$msgbox.confirm('此操作将从目录下删除该文档, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.levelTwo[key].splice(index, 1)
        vm.saveDir()
        vm.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    saveDir () {
      const vm = this
      const levelTwoStr = JSON.stringify(vm.levelTwo)
      const dir = JSON.parse(levelTwoStr)
      vm.$store.commit('article/GET_SEC_DIR', { levelTwo: dir })
    },
    getRecycle () {
      const vm = this
      vm.$store.dispatch('article/getStatus', 'API')
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
        disabled: this.isRecycle,
        ghostClass: 'ghost'
      }
    },
    ...mapState('article', [
      'title', 'chooseDir', 'article', 'isRecycle'
    ]),
    levelOne: {
      get () {
        return this.$store.state.article.levelOne
      },
      set (value) {
        this.$store.commit('article/UPDATE_DIRECTORY', { dir: value })
      }
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  watch: {
    title (title) {
      const vm = this
      Object.keys(vm.levelTwo).map(path => {
        vm.levelTwo[path].map((article, index) => {
          if (vm.article._id === article._id) {
            vm.levelTwo[path].splice(index, 1, { _id: vm.article._id, title })
          }
        })
      })
    },
    chooseDir (val) {
      if (!val) {
        this.makeSelected(-1)
      } else {
        this.$store.dispatch('article/getStatus', false)
      }
    }
  },
  components: {
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
#dragCol .level-two:hover, #dragCol .selected,#dragCol .recycle:hover{
  color: #f63;
  background-color: #fff !important;
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
#dragCol .recycle {
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