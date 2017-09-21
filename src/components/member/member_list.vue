<template>
  <div id="memberLIst">
    <div class="header">
      <el-input
        placeholder="手机号/会员名称"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        v-model="value"
        icon="search"
        >
      </el-input>
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
          property="cost"
          :formatter="formatFee"          
          header-align="center"
          label="消费金额 (元)"
          >
        </el-table-column>
        <el-table-column
          property="create_time"
          header-align="center"
          :formatter="formatTime"
          label="注册时间">
        </el-table-column>
        <el-table-column
          v-if="power.has('member/project/query')"
          label="操作"
          header-align="center"
          width="200">
          <template scope="scope">
            <el-button
              @click.native.prevent="$router.push({path: '/member/member_api',query: {id: scope.row._id}})"
              type="text"
              size="small">
              查看项目  
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
  </div>
</template>

<script>
import { getMemberList } from '../../api/member.js'
import { formatTime } from '../../utils/index.js'

export default {
  name: 'member_list',
  data () {
    return {
      value: '',
      list: [],
      count: 0,
      currentPage: 1
    }
  },
  mounted () {
    const vm = this
    vm.getMemberList(1)
  },
  methods: {
    getMemberList (page) {
      const vm = this
      getMemberList({name: vm.value, page}).then(res => {
        if (res.data.status === 200) {
          vm.list = res.data.data.members
          vm.count = res.data.data.count
        }
      })
    },
    fuzzySearch () {
      this.getMemberList(1)
    },
    // 格式化费用
    formatFee (raw) {
      if (!raw.cost) return 0
      return raw.cost.toFixed(2)
    },
    // 格式化购买时间
    formatTime (row) {
      return formatTime(row.update_time / 1000, '{y}-{m}-{d}')
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
#memberLIst {
  width: 1200px;
  margin: 60px auto;
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
  height: 500px;  
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

