<template>
  <div id="techList">
    <doc-header :pub="true" :preview="true" :editable="true"></doc-header>
    <drag-list v-if="power.has('pub/query')"></drag-list>
    <div class="left-list">
      <div class="search">
        <el-button @click="saveContent">返回</el-button>
        <el-select v-model="sort" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
        <el-input
          placeholder="搜索"
          @keyup.enter.native="search"
          icon="search"
          v-model="keyWord"
          :on-icon-click="search"
          >
        </el-input>
      </div>
      <div class="title">
        <span>文章</span>
        <span>作者</span>
        <span>发布时间</span>
      </div>
      <draggable class="article" element="div" v-model="articleList" :options="dragOptions" :move="onMove"> 
        <li  v-for="(col, index) of articleList" :key="col._id"> 
          <span>
            {{col.title}}
          </span>
          <span>
            {{col.author ? col.author.username : ''}}
          </span>
          <span>
            {{formatter(col.update_time)}}
          </span>
        </li> 
      </draggable>
    </div>
    <div class="page">
      <el-pagination
        :current-page.sync="currentPage"
        @current-change="getDoc"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import docHeader from '../widget/document_header'
import dragList from '../widget/dragable_list'
import draggable from 'vuedraggable'
import { getAPIDoc, getSort } from '../../api/articles.js'
import { formatTime } from '../../utils/index.js'

export default {
  title: 'tech_list',
  data () {
    return {
      articleList: [],
      options: [
        {
          name: '所有分类',
          _id: ''
        }
      ],
      sort: '',
      keyWord: '',
      currentPage: 1,
      count: 0
    }
  },
  mounted () {
    const vm = this
    vm.getDoc(1)
    getSort().then(res => {
      if (res.data.status === 200) {
        vm.options = [...vm.options, ...res.data.data.sorts]
      }
    })
  },
  components: {
    docHeader,
    dragList,
    draggable,
    getAPIDoc
  },
  methods: {
    getDoc (page) {
      const vm = this
      getAPIDoc({label: 'List', page, title: vm.keyWord, sort: vm.sort, limit: 10}).then(res => {
        if (res.data.status === 200) {
          vm.articleList = res.data.data
          vm.count = res.data.count
        }
      })
    },
    search () {
      this.currentPage = 1
      this.getDoc(1)
    },
    // 格式化时间
    formatter (time) {
      return formatTime(time / 1000)
    },
    // 保存状态
    saveContent () {
      const vm = this
      vm.$store.commit('project/CHECK_SAVE', true)
      vm.$router.go(-1)
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
        disabled: this.isRecycle,
        ghostClass: 'ghost',
        sort: false
      }
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  watch: {
    sort (id) {
      // 分类选择时清空搜索选项
      this.keyWord = ''
      this.search()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/repo/repo_edit/repoPlatform') {
      const state = !!this.$store.state.project.clients.length
      this.$store.commit('project/CHECK_SAVE', state)
    }
    next()
  }
}
</script>

<style scoped>
#techList {
  overflow: hidden;
}
#techList .left-list {
  margin-left: 180px;
  height: 560px;
  padding: 30px;
  line-height: 40px;
  text-align: center;
}
#techList .search {
  text-align: left;
  padding: 10px;
}
#techList .search .el-input{
  width: 200px;
  margin: 0 10px;
}
#techList .left-list .title {
  background-color: #eef1f6;
}
#techList .left-list span{
  display: inline-block;
  width: 33%;
}
#techList .article li:hover  {
  background-color: #eef1f6;
  cursor: pointer;
}
#techList .page {
  text-align: center;
}
#dragCol .ghost span {
  display: none; 
}
#dragCol .ghost span:first-child {
  display: inline-block;  
  margin-left: 35px;
  width: 108px;
  text-indent: 0;
  height: 45px;  
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;
}
</style>
