<template>
  <div id="repoList">
    <div class="handdle">
      <el-button　@click="$router.push('/repo/repo_add')">添加项目</el-button>
      <el-select v-model="selected" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input
        placeholder="搜索"
        icon="search"
        v-model="keyWord"
        :on-icon-click="search"
        >
      </el-input>
    </div>
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
        width="150">
      </el-table-column>
      <el-table-column
        prop="server.host"
        label="服务器地址"
        >
      </el-table-column>
      <el-table-column
        prop="statusText"
        label="状态"
        >
      </el-table-column>
      <el-table-column
        prop="part"
        label="价格"
        >
      </el-table-column>
      <el-table-column
        prop="count"
        label="总销量"
        >
      </el-table-column>    
      <el-table-column
        label="操作"
        width="200">
        <template scope="scope">
          <el-button
            type="text"
            size="small">
            API
          </el-button>
          <el-button
            type="text"
            size="small">
            客户端
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="$router.push({path:'/repo/repo_edit', query: {id: scope.row._id }})"
            >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="changeStatus(scope.row._id, scope.row.status, scope.$index)"
            >
            {{scope.row.status === 'online' ? '下架' : '上架'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
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
            data.statusText = data.status === 'online' ? '上架中' : '已下架'
          })
          vm.tableData = res.data.data.projects
          vm.count = res.data.data.count
        }
      })
    },
    // 搜索
    search () {
      const vm = this
      vm.getProjectList(vm.currentPage, vm.keyWord)
    },
    // 切换上下架功能
    changeStatus (id, status, index) {
      console.log(index)
      status = status === 'online' ? 'offline' : 'online'
      const vm = this
      editProject({id, status}).then(res => {
        if (res.data.status === 200) {
          vm.$set(vm.tableData[index], 'statusText', status === 'online' ? '上架中' : '已下架')
          vm.$set(vm.tableData[index], 'status', status)
          vm.$message({
            type: 'success',
            message: status === 'online' ? '上架成功' : '下架成功'
          })
        }
      })
    }
  },
  watch: {
    selected () {
      this.getProjectList(this.currentPage)
    }
  }
}
</script>

<style>
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
#repoList .cell {
  text-align: center;
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
</style>
