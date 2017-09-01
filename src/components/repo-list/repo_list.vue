<template>
  <div id="repoList">
    <div class="handdle">
      <el-button　@click="$router.push('/repo/repo_add')">添加项目</el-button>
      <el-cascader
        :options="options"
        v-model="selected"
      ></el-cascader>
      <el-input
        placeholder="搜索"
        icon="search"
        v-model="search"
        :on-icon-click="handleIconClick"
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
        prop="status"
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
            size="small">
            下架
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
import { getProjectList } from '../../api/projects.js'
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
      search: '',
      selected: ['']
    }
  },
  methods: {
    getProjectList (page) {
      const vm = this
      getProjectList({page}).then(res => {
        if (res.data.status === 200) {
          vm.tableData = res.data.data.projects
          vm.count = res.data.data.count
        }
      })
    },
    handleIconClick () {
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
#repoList .el-cascader {
  margin-right: 10px;
}
</style>
