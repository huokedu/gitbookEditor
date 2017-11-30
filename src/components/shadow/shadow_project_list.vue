<template>
  <div id="repoList">
    <div class="handdle">
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
        ref="projectTable"
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
          prop="create_time"
          header-align="center"
          :formatter="formatTime"
          label="创建时间"
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
          v-if="power.has('shadow/project/buy')"
          label="操作"
          header-align="center"
          width="200">
          <template scope="scope">
            <el-button
              type="text"
              size="tiny"
              :center="false"
              :fullscreen="true"
              @click="makeSelection(scope.row)"  
            >
              购买项目
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
    <el-dialog
      :title="'项目名称：'+ selectedPro.name"
      :visible.sync="dialogVisible"
      @close="resetDefault"
      size="big"
    >
      <span>选择购买项目用户:</span>
      <div class="user-list">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkList" @change="handleCheckedUsersChange">
          <el-checkbox v-for="user in userList" 
          :label="user._id" 
          :disabled="user.isbuy" 
          :key="user._id">{{user.name}}{{user.isbuy ? '(已购买)' : ''}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="buyProject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectList } from '../../api/projects.js'
import { getShadowList, shadowBuyProject } from '../../api/shadow.js'
import { formatTime } from '../../utils/index.js'
export default {
  name: 'repo_list',
  mounted () {
    this.getProjectList(1)
  },
  data () {
    return {
      tableData: [],
      count: 0,
      currentPage: 1,
      keyWord: '',
      dialogVisible: false,
      selectedPro: {},
      userList: '',
      checkList: [],
      userIds: [],
      defaultCheckList: [],
      isIndeterminate: false,
      checkAll: false
    }
  },
  methods: {
    getShadowList (page, limit, pid) {
      const vm = this
      vm.checkList = []
      vm.defaultCheckList = []
      // 请求用户列表
      // 重置用户列表
      getShadowList({page, limit}).then(res => {
        if (res.data.status === 200) {
          vm.userList = res.data.data.shadowUsers.map(user => {
            const obj = user.shadow_user
            obj.projects = user.projects
            // 默认选项
            vm.userIds.push(obj._id)
            // 判断是否购买项目
            user.projects.map(project => {
              if (project._id === pid) {
                console.log(obj._id)
                vm.checkList.push(obj._id)
                vm.defaultCheckList.push(obj._id)
                obj.isbuy = true
              }
            })
            return obj
          })
        }
      })
    },
    getProjectList (page, name) {
      const vm = this
      getProjectList({ page, status: 'online', name }).then(res => {
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
    // 选中项目
    makeSelection (project) {
      const vm = this
      vm.selectedPro = project
      vm.dialogVisible = true
      vm.getShadowList(1, 50, project._id)
    },
    // 购买项目
    buyProject () {
      const vm = this
      if (!vm.selectedPro._id || vm.checkList.length <= vm.defaultCheckList.length) {
        return vm.$message({
          type: 'warning',
          message: '请选择购买用户'
        })
      }
      // 去除已购买用户
      const buyUsers = {}
      vm.checkList.map(id => {
        buyUsers[id] = id
      })
      vm.defaultCheckList.map(id => {
        delete buyUsers[id]
      })
      shadowBuyProject({project: vm.selectedPro._id, users: Object.keys(buyUsers)})
      .then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: res.data.message
          })
          vm.dialogVisible = false
          // 更新购买数量
          vm.$set(vm.selectedPro, 'count', vm.selectedPro.count + Object.keys(buyUsers).length)
        }
      })
    },
    // 单选处理
    handleCheckedUsersChange (value) {
      const vm = this
      const checkedCount = value.length
      vm.checkAll = checkedCount === vm.userIds.length
      vm.isIndeterminate = checkedCount > 0 && checkedCount < vm.userIds.length
    },
    // 全选处理
    handleCheckAllChange (val) {
      const vm = this
      vm.checkList = vm.checkAll ? vm.userIds : vm.defaultCheckList
      vm.isIndeterminate = false
    },
    // 关闭dialog时恢复重置选中
    resetDefault () {
      const vm = this
      vm.checkAll = false
      vm.isIndeterminate = false
    },
    // 格式化购买时间
    formatTime (row) {
      return formatTime(row.create_time / 1000, '{y}-{m}-{d}')
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
  }
}
</script>

<style scoped>
#repoList {
  width: 1200px;
  margin: 40px auto;
}
#repoList .handdle {
  padding: 20px;
  font-size: 0;
  text-align: right;
}
#repoList .list {
  text-align: center;  
   height: 500px;
}
#repoList .el-pagination {
  margin: 30px;
  text-align: center;
}
#repoList .el-dropdown {
  margin: 10px 20px;
}
#repoList .el-input {
  width: 200px;
}
#repoList .el-button{
  vertical-align: text-bottom;
}
#repoList .el-select {
  margin-right: 10px;
}
#repoList .cell {
  text-align: center;
}
#repoList .el-checkbox {
  margin: 20px;
}
#repoList .user-list {
  padding: 20px;
}
</style>
