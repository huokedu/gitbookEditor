<template>
  <div id="repoList">
    <div class="handdle">
      <el-button　@click="$router.push('/repo/repo_add')" v-if="power.has('project/add')">添加项目</el-button>
      <el-select v-model="selected" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        placeholder="请输入项目名称"
        icon="search"
        @keyup.enter.native="search"
        v-model="keyWord"
        :on-icon-click="search"
        >
      </el-input>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        stripe
        >
        <el-table-column
          type="selection"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="项目"
          header-align="center"      
          width="150">
        </el-table-column>
        <el-table-column
          prop="server.host"
          header-align="center"
          label="服务器地址"
          >
        </el-table-column>
        <el-table-column
          prop="statusText"
          header-align="center"
          label="状态"
          >
        </el-table-column>
        <el-table-column
          prop="part"
          header-align="center"
          label="价格"
          >
        </el-table-column>
        <el-table-column
          prop="count"
          header-align="center"
          label="总销量"
          >
        </el-table-column>    
        <el-table-column
          label="操作"
          header-align="center"
          width="250"
        >
          <template scope="scope">
            <el-button
              v-if="power.has('article/list')"
              type="text"
              size="small"
              @click="$router.push({path:'/repo/API_document', query: {API_id: scope.row.API }})"
              >
              API
            </el-button>
            <el-button
              v-if="power.has('project/client/query')"
              type="text"
              size="small"
              @click="editPro(scope.row._id)"
              >
              客户端
            </el-button>
            <el-button
              v-if="power.has('project/details')"
              type="text"
              size="small"
              @click="$router.push({path:'/repo/repo_edit', query: {id: scope.row._id }})"
              >
              编辑
            </el-button>
            <el-button
              v-if="power.has('project/edit') && scope.row.status === 'offline'"
              type="text"
              size="small"
              @click="changeStatus(scope.row._id, 'pre', scope.$index)"
              >
              预售
            </el-button>
            <el-button
              v-if="power.has('project/edit') && scope.row.status === 'offline'"
              type="text"
              size="small"
              @click="changeStatus(scope.row._id, 'online', scope.$index)"
              >
              上架
            </el-button>
            <el-button
              v-if="power.has('project/edit') && scope.row.status !== 'offline'"
              type="text"
              size="small"
              @click="changeStatus(scope.row._id, 'offline', scope.$index)"
              >
              下架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      :current-page.sync="currentPage"
      @current-change="getProjectList"
      layout="total, prev, pager, next"
      :total="count">
    </el-pagination>
  </div>
</template>

<script>
import { getProjectList, editProject } from '../../api/projects.js'
export default {
  name: 'repo_list',
  mounted () {
    this.getProjectList(1)
  },
  data () {
    return {
      tableData: [],
      options: [
        {
          value: '',
          label: '全部项目'
        },
        {
          value: 'online',
          label: '销售中'
        },
        {
          value: 'offline',
          label: '已下架'
        }
      ],
      count: 50,
      currentPage: 1,
      keyWord: '',
      selected: ''
    }
  },
  methods: {
    getProjectList (page, name) {
      const vm = this
      getProjectList({ page, status: vm.selected, name }).then(res => {
        if (res.data.status === 200) {
          res.data.data.projects.map(data => {
            data.statusText = data.status === 'offline' ? '已下架' : data.status === 'online' ? '上架中' : '预售中'
            if (!data.part) data.part = 'N/A'
          })
          vm.tableData = res.data.data.projects
          vm.count = res.data.data.count
        }
      })
    },
    // 搜索
    search () {
      const vm = this
      vm.currentPage = 1
      vm.getProjectList(vm.currentPage, vm.keyWord)
    },
    // 切换上下架功能
    changeStatus (id, status, index) {
      const vm = this
      editProject({id, status}).then(res => {
        if (res.data.status === 200) {
          vm.$set(vm.tableData[index], 'statusText', status === 'offline' ? '已下架' : status === 'online' ? '上架中' : '预售中')
          vm.$set(vm.tableData[index], 'status', status)
          const message = status === 'offline' ? '下架成功' : status === 'online' ? '上架成功' : '预售成功'
          vm.$message({
            type: 'success',
            message
          })
        }
      })
    },
    editPro (id) {
      const vm = this
      vm.$store.commit('project/CHECK_SAVE', false)
      vm.$router.push({path: '/repo/repo_edit/repoPlatform', query: {platform: id}})
    }
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  watch: {
    selected () {
      this.getProjectList(this.currentPage)
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('project/GET_CLIENT', [])
    next()
  }
}
</script>

<style scoped>
#repoList {
  width: 1200px;
  margin: 40px auto;
  text-align: center;
}
#repoList .handdle {
  padding: 20px;
  font-size: 0;
  text-align: right;
}
#repoList .list {
   height: 500px;  
}
#repoList .el-pagination {
  margin: 30px;
}
#repoList .el-dropdown {
  margin: 10px 20px;
}
#repoList .el-input {
  width: 200px;
}
#repoList .el-button{
  vertical-align: text-bottom;
  float: left;
}
#repoList .el-select {
  margin-right: 10px;
}
#repoList .cell {
  text-align: center;
}
</style>
