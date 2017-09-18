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
      <el-button @click="addUser">
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
          property="phone"
          header-align="center"
          label="手机号"
          >
        </el-table-column>
        <el-table-column
          property="update_time"
          header-align="center"
          :formatter="formatTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          width="200">
          <template scope="scope">
            <el-button
              type="text"
              @click.native.prevent="editUser(scope.row)"
              size="small">
              编辑 
            </el-button>
            <el-button
              type="text"
              @click.native.prevent="delUser(scope)"
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
        @current-change="getMemberList"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="show">
      <edit-user v-if="show" :user="user" @update="updateMemberList"></edit-user>   
    </el-dialog>
  </div>
</template>

<script>
import { getMemberList } from '../../api/member.js'
import { delUser } from '../../api/shadow.js'
import { formatTime } from '../../utils/index.js'
import editUser from '../widget/edit_shadow_user'
export default {
  name: 'member_list',
  data () {
    return {
      value: '',
      list: [],
      count: 0,
      show: false,
      user: {},
      currentPage: 1
    }
  },
  mounted () {
    const vm = this
    vm.getMemberList(1)
  },
  components: {
    editUser
  },
  methods: {
    getMemberList (page) {
      const vm = this
      getMemberList({name: vm.value, page, shadow: true}).then(res => {
        if (res.data.status === 200) {
          vm.list = res.data.data.members
          vm.count = res.data.data.count
        }
      })
    },
    // 更新列表
    updateMemberList (user) {
      const vm = this
      vm.show = false
      vm.list.pop()
      vm.list.unshift(user)
    },
    fuzzySearch () {
      this.getMemberList(1)
    },
    // 格式化费用
    formatFee (row) {
      return row.cost.toFixed(2)
    },
    // 格式化购买时间
    formatTime (row) {
      return formatTime(row.update_time / 1000, '{y}-{m}-{d}')
    },
    // 添加用户
    addUser () {
      const vm = this
      vm.user = {}
      vm.show = true
    },
    // 删除用户
    delUser (scoped) {
      const vm = this
      delUser(scoped.row._id).then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: '删除成功'
          })
          vm.list.splice(scoped.$index, 1)
        }
      })
    },
    // editUser
    editUser (row) {
      const vm = this
      vm.user = row
      vm.show = true
    }
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

