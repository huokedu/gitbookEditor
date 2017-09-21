<template>
  <div id="docList">
    <div class="handdle">
      <el-button　@click="$router.push('/tech_list/add')" v-if="power.has('article/add')">添加文章</el-button>
      <el-select v-model="sort" placeholder="请选择" v-if="power.has('sort/list')">
        <el-option
          v-for="item in options"
          :key="item._id"
          :label="item.name"
          :value="item._id">
        </el-option>
      </el-select>
      <el-input
        placeholder="搜索文章名称"
        icon="search"
        v-model="keyWord"
        :on-icon-click="search"
        >
      </el-input>
    </div>
    <el-table
      :data="tableData"
      @filter-change="resetTable"
      stripe
      >
      <el-table-column
        type="selection"
        >
      </el-table-column>
      <el-table-column
        prop="title"
        label="文章"
        header-align="center"
        >
      </el-table-column>
      <el-table-column
        prop="author.username"
        header-align="center"
        label="作者"
        >
      </el-table-column>
      <el-table-column
        prop="sort.name"
        header-align="center"
        label="分类"
        >
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        width="250"
        header-align="center"
        :filters="allTags"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template scope="scope">
          <el-tag
            v-for="tag in scope.row.tags"
            :key="tag._id"
            :type="selectedTags.has(tag._id) ? 'primary' : 'grey'"
            close-transition
          >{{tag.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="update_time"
        header-align="center"
        width="240px"
        label="发布日期"
        :formatter="formatter"
        >
      </el-table-column>    
      <el-table-column
        label="操作"
        header-align="center"
        width="100">
        <template scope="scope">
          <el-button
            v-if="power.has('article/edit')"      
            type="text"
            size="small"
            @click="$router.push({path: '/tech_list/edit', query: {_id: scope.row._id}})"
            >
            编辑
          </el-button>
          <el-button
            v-if="power.has('article/del')"      
            type="text"
            size="small"
            @click="delArticle(scope.$index, scope.row)"
            >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      @current-change="getAPIDoc"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>
  </div>
</template>

<script>
import { getAPIDoc, getSort, getTags, delDoc } from '../../api/articles.js'
import { formatTime } from '../../utils/index.js'
export default {
  name: 'repo_list',
  mounted () {
    const vm = this
    vm.getAPIDoc(1)
    vm.getTags()
    vm.getSort()
  },
  data () {
    return {
      tableData: [],
      options: [
        {
          name: '所有分类',
          _id: ''
        }
      ],
      count: 0,
      currentPage: 1,
      keyWord: '',
      sort: '',
      selectedTags: new Set(),
      allTags: [],
      timer: 0
    }
  },
  methods: {
    getAPIDoc (page) {
      const vm = this
      getAPIDoc({label: 'List', page, tags: vm.selectedTags, title: vm.keyWord, sort: vm.sort}).then(res => {
        vm.tableData = res.data.data
        vm.count = res.data.count
      })
    },
    getTags () {
      const vm = this
      getTags().then(res => {
        res.data.data.map((tag, index) => {
          vm.allTags[index] = {}
          vm.allTags[index].text = tag.name
          vm.allTags[index].value = tag._id
        })
      })
    },
    delArticle (index, article) {
      console.log(index)
      let vm = this
      vm.$msgbox.confirm('删除文档到回收站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDoc(article._id).then((res) => {
          vm.tableData.splice(index, 1)
          vm.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 格式化时间
    formatter (row) {
      return formatTime(new Date(row.update_time).getTime() / 1000)
    },
    // 过滤标签
    filterTag (value, row) {
    },
    // 重置标签过滤
    resetTable (filter) {
      console.log(1)
      const vm = this
      const value = Object.values(filter)[0]
      vm.selectedTags.clear()
      if (!value.length) {
        vm.getAPIDoc(1)
        return true
      } else {
        console.log(value)
        value.map(id => {
          if (!vm.selectedTags.has(id)) vm.selectedTags.add(id)
        })
        // 最后一次调用函数时调用
        clearTimeout(vm.timer)
        vm.timer = setTimeout(() => { vm.getAPIDoc(1) }, 0)
        return true
      }
    },
    getSort () {
      const vm = this
      getSort().then(res => {
        if (res.data.status === 200) {
          vm.options = [...vm.options, ...res.data.data.sorts]
        }
      })
    },
    // 搜索
    search () {
      this.getAPIDoc(1)
    }
  },
  computed: {
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
  }
}
</script>

<style scoped>
#docList {
  width: 1200px;
  margin: 40px auto;
  text-align: center;
}
#docList .handdle {
  padding: 20px;
  font-size: 0;
  text-align: right;
}
.el-table__header {
  text-align: center;
}
#docList .el-pagination {
  margin: 30px;
}
#docList .el-dropdown {
  margin: 10px 20px;
}
#docList .el-input {
  width: 200px;
}
#docList .el-tag {
  margin: 2px 10px 2px 0;
}
#docList .el-button{
  vertical-align: text-bottom;
  float: left;
}
#docList .el-select {
  margin-right: 10px;
}
</style>
