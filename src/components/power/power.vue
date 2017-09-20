<template>
  <div id="power">
    <div class="header">
      <span class="title">用户名称：</span>
      <el-select v-model="userId" filterable placeholder="请选择">
        <el-option
          v-for="item in userList"
          :key="item._id"
          :label="item.name"
          :value="item._id">
        </el-option>
      </el-select>
      <el-button @click="addAdmin">
        添加管理员
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
          property="user._id"
          header-align="center"
          label="用户id"
          >
        </el-table-column>
        <el-table-column
          property="user.name"
          header-align="center"
          label="管理员名称"
          >
        </el-table-column>
        <el-table-column
          property="user.phone"
          header-align="center"
          label="手机号"
          >
        </el-table-column>
        <el-table-column
          property="create_time"
          header-align="center"
          :formatter="formatTime"
          label="成为管理员时间">
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          width="200">
          <template scope="scope">
            <el-button
              type="text"
              @click.native.prevent="$router.push({path: '/power/edit', query: {id: scope.row.user._id}})"
              size="small">
              编辑 
            </el-button>
            <el-button
              type="text"
              @click.native.prevent="delAdmin(scope)"
              size="small">
              删除
            </el-button>
          </template>  
        </el-table-column>
      </el-table>       
    </div>
    <div class="block">
      <el-pagination
        :page-size="10"
        @current-change="getAdminList"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="show">
      <edit-power></edit-power>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminList, delAdmin, addAdmin } from '../../api/power.js'
import { getMemberList } from '../../api/member.js'
import {formatTime} from '../../utils'
export default {
  name: 'power',
  data () {
    return {
      list: [],
      userId: '',
      userList: [],
      show: false,
      count: 0,
      currentPage: 1
    }
  },
  mounted () {
    const vm = this
    vm.getAdminList(1)
    vm.getMemberList()
  },
  methods: {
    // 获取管理员列表
    getAdminList (page) {
      const vm = this
      getAdminList({page}).then(res => {
        if (res.data.status === 200) {
          vm.list = res.data.data.users
          vm.count = res.data.data.count
        }
      })
    },
    // 获取用户列表
    getMemberList () {
      const vm = this
      getMemberList({limit: 0, shadow: true}).then(res => {
        if (res.data.status === 200) {
          vm.userList = res.data.data.members
        }
      })
    },
    // 格式化注册时间
    formatTime (row) {
      return formatTime(row.create_time / 1000, '{y}-{m}-{d}')
    },
    // 添加管理员
    addAdmin () {
      const vm = this
      if (!vm.userId) {
        return vm.$message({
          type: 'success',
          message: '请选择需要添加的用户'
        })
      }
      addAdmin(vm.userId).then(res => {
        if (res.data.status === 200 || res.data.status === 304) {
          vm.list.unshift(res.data.data.user)
          vm.$message({
            type: 'success',
            message: res.data.message
          })
        }
      })
    },
    // 删除管理员
    delAdmin (scoped) {
      const vm = this
      delAdmin(scoped.row.user._id).then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: '删除成功'
          })
          vm.list.splice(scoped.$index, 1)
        }
      })
    },
    // 查询权限
    queryAdmin (row) {
      const vm = this
      vm.user = row
      vm.show = true
    }
  }
}
</script>

<style scoped>
#power {
  width: 1200px;
  margin: 60px auto;
  text-align: center;
}
#power .header{
  padding: 0 20px;
  text-align: left;
  overflow: hidden;
}
#power .header .el-button {
  float: right;
}
#power .header .el-input{
  width: 200px;
  margin-right: 100px;
}
#power .list {
  margin-top: 30px;
  height: 500px;  
}
#power .block {
  margin: 20px;
}
#power .user-reply{
  margin-bottom: 20px;
  line-height: 28px;
}
#power .user-reply span:last-child{
  display: inline-block;
  text-indent: 28px;
}
</style>

