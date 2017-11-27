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
          property="phone"
          header-align="center"
          label="手机号"
          >
        </el-table-column>
        <el-table-column
          property="create_time"
          header-align="center"
          :formatter="formatTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          v-if="power.has('shadow/generate/user') || power.has('shadow/user/del')"
          label="操作"
          header-align="center"
          width="200">
          <template scope="scope">
            <el-button
              v-if="power.has('shadow/generate/user')"
              type="text"
              @click.native.prevent="editUser(scope)"
              size="small">
              编辑 
            </el-button>
            <el-button
              v-if="power.has('shadow/user/del')"
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
        @current-change="getShadowList"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { generateUser, getShadowList } from '../../api/shadow.js'
import { formatTime } from '../../utils/index.js'
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
      loading: ''
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
          vm.list = res.data.data.shadowUsers.map(user => user.shadow_user)
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
    }
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
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

