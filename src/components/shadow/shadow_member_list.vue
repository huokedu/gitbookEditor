<template>
  <div id="shadowMemberList">
    <div class="header">
      <el-input
        placeholder="手机号/会员名称"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        v-model="value"
        icon="search"
        >
      </el-input>
      <el-button @click="generateUser" v-if="power.has('shadow/generate/user')">
        添加用户
      </el-button>
    </div>
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
          property="_id"
          header-align="center"
          label="用户id"
          >
        </el-table-column>
        <el-table-column
          property="name"
          header-align="center"
          label="会员名称"
          >
        </el-table-column>
        <el-table-column
          property="projects.length"
          header-align="center"
          label="购买项目数"
          width="120"
          >
        </el-table-column>
        <el-table-column
          property="comments.length"
          header-align="center"
          label="评论数"
          width="80"
          >
        </el-table-column>
        <el-table-column
          property="create_time"
          header-align="center"
          :formatter="formatTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          v-if="power.has('shadow/user/del')"
          label="操作"
          header-align="center"
          width="250">
          <template scope="scope">
            <el-button
              v-if="true"
              type="text"
              @click.native.prevent="$router.push({path: '/shadow/user/details', query: { id: scope.row._id }})"
              size="small">
              用户详情
            </el-button>
            <el-button
              v-if="power.has('shadow/user/del') && scope.row.can_delete"
              type="text"
              :disabled="!scope.row.can_delete"
              @click.native.prevent="editUser(scope.row)"
              size="small">
              编辑
            </el-button>
            <el-button
              v-if="power.has('shadow/user/del')"
              type="text"
              :disabled="!scope.row.can_delete"
              @click.native.prevent="delUser(scope)"
              size="small">
              {{scope.row.can_delete ? '删除' : '已有用户行为，无法编辑、删除'}}
            </el-button>
          </template>  
        </el-table-column>
      </el-table>       
    </div>
    <div class="block">
      <el-pagination
        :page-size="10"
        @current-change="getShadowList"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
    <el-dialog
      :visible.sync="editVisible"
      size="tiny"
      >
       <edit-user v-if="editVisible" :user="currentUser" :visible.sync="editVisible"></edit-user>   
    </el-dialog>
  </div>
</template>

<script>
import { generateUser, getShadowList, delUser } from '../../api/shadow.js'
import { formatTime } from '../../utils/index.js'
import editUser from '../widget/edit_user'
export default {
  name: 'member_list',
  data () {
    return {
      value: '',
      list: [],
      count: 0,
      show: false,
      form: {},
      currentPage: 1,
      loading: '',
      editVisible: false,
      currentUser: {}
    }
  },
  mounted () {
    const vm = this
    vm.getShadowList(1)
  },
  methods: {
    getShadowList (page) {
      const vm = this
      getShadowList({page, user: vm.value}).then(res => {
        if (res.data.status === 200) {
          vm.list = res.data.data.shadowUsers.map(user => {
            const obj = user.shadow_user
            obj.can_delete = user.can_delete
            obj.comments = user.comments
            obj.projects = user.projects
            return obj
          })
          vm.count = res.data.data.count
        }
      })
    },
    fuzzySearch () {
      const vm = this
      vm.currentPage = 1
      vm.getShadowList(1)
    },
    // 格式化购买时间
    formatTime (row) {
      return formatTime(row.create_time / 1000, '{y}-{m}-{d}')
    },
    // 批量添加用户
    generateUser () {
      const vm = this
      vm.$prompt('请输入生成用户数量(生成用户数量小于等于30)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // 检校函数
        inputValidator: (value) => {
          return value !== '' && value % 1 === 0 && value <= 30
        },
        inputErrorMessage: '请输入小于等于30的整数'
      }).then(({ value }) => {
        if (!value) return
        vm.loading = vm.$loading({
          lock: true,
          text: '生成用户中，请稍后...'
        })
        generateUser(value).then(res => {
          if (res.data.status === 200) {
            vm.$message({
              type: 'success',
              message: res.data.message
            })
          }
          vm.getShadowList(1)
          vm.loading.close()
        })
      }).catch(() => {
        if (vm.loading) vm.loading.close()
        vm.$message({
          type: 'info',
          message: '取消输入'
        })
      })
      generateUser
    },
    // 删除用户
    delUser (scope) {
      const vm = this
      const id = scope.row._id
      delUser(id).then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: res.data.message
          })
          vm.list.splice(scope.$index, 1)
        } else {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
      .catch(() => {
        vm.$message({
          type: 'error',
          message: '服务器内部错误'
        })
      })
    },
    // 编辑用户
    editUser (user) {
      const vm = this
      vm.currentUser = user
      vm.editVisible = true
    }
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  components: {
    editUser
  }
}
</script>

<style scoped>
#shadowMemberList {
  width: 1200px;
  margin: 60px auto;
  text-align: center;
}
#shadowMemberList .header{
  padding: 0 20px;
  text-align: left;
}
#shadowMemberList .header .el-button {
  float: right;
}
#shadowMemberList .header .el-input{
  width: 200px;
  margin-right: 100px;
}
#shadowMemberList .list {
  margin-top: 30px;
  height: 500px;  
}
#shadowMemberList .block {
  margin: 20px;
}
#shadowMemberList .user-reply{
  margin-bottom: 20px;
  line-height: 28px;
}
#shadowMemberList .user-reply span:last-child{
  display: inline-block;
  text-indent: 28px;
}
</style>

