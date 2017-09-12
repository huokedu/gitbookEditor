<template>
  <div id="memberLIst">
    <div class="list">
      <el-table
        ref="List"
        border
        :data="list"
       >
        <el-table-column
          type="index"
          header-align="center"
          label="序号"
          width="65"
          >
        </el-table-column>
        <el-table-column
          property="project.name"
          header-align="center"
          label="项目名称"
          >
        </el-table-column>
        <el-table-column
          property="count"
          header-align="center"
          label="可用次数"
          >
        </el-table-column>
        <el-table-column
          property="project.used"
          header-align="center"
          label="使用次数">
        </el-table-column>
        <el-table-column
          property="project.cost"
          header-align="center"
          :formatter="formmatPrice"
          label="价格 (元)"
          >
        </el-table-column>  
        <el-table-column
          label="操作"
          header-align="center"
          width="200">
          <template scope="scope">
            <el-button 
              type="text"
              @click.native.prevent="setKeyStatus(scope.row)"
              size="small">
              {{scope.row.status ? '禁用密匙' : '启用密匙'}}
            </el-button>
            <el-button 
              type="text"
              @click.native.prevent="$router.push({path: '/member/member_project',query: {userId: scope.row.user, proId: scope.row.project._id}})"
              size="small">
              使用详情
            </el-button>
          </template> 
        </el-table-column>
      </el-table>       
    </div>
    <div class="block">
      <el-pagination
        :page-size="10"
        @current-change="getUserProject"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserProject, setKeyStatus } from '../../api/member.js'
export default {
  name: 'member_api',
  data () {
    return {
      value: '',
      list: [],
      currentPage: 1,
      count: 0
    }
  },
  mounted () {
    const vm = this
    vm.getUserProject(vm.$route.query.id)
  },
  methods: {
    getUserProject () {
      const vm = this
      getUserProject(vm.$route.query.id).then(res => {
        if (res.data.status === 200) {
          vm.list = res.data.data.user
          vm.count = res.data.data.count
        }
      })
    },
    // 格式化价格
    formmatPrice (row) {
      if (row.project) return row.project.cost.toFixed(2)
      return ''
    },
    // 设定密匙激活状态
    setKeyStatus (row) {
      const vm = this
      const target = vm.list[0]
      const message = row.status ? '此操作将禁用用户该项目接口, 是否继续?' : '此操作将激活用户该项目接口, 是否继续?'
      vm.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setKeyStatus({userId: target.user, proId: target.project._id, status: !row.status}).then(res => {
          if (res.data.status === 200) {
            row.status = !row.status
            vm.$message({
              type: 'success',
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
#memberLIst {
  width: 1200px;
  margin: 40px auto;
  text-align: center;
}
#memberLIst .header{
  text-align: left;
}
#memberLIst .header .el-input, #memberLIst .header .el-select{
  width: 200px;
  margin-right: 100px;
}
#memberLIst .list {
  margin-top: 30px;
  height: 560px;  
}
#memberLIst .block {
  margin: 20px;
}
#memberLIst .user-reply{
  margin-bottom: 20px;
  line-height: 28px;
}
#memberLIst .user-reply span:last-child{
  display: inline-block;
  text-indent: 28px;
}
</style>

