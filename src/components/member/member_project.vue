<template>
  <div id="memberProject">
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
          property="router"
          header-align="center"
          label="接口地址"
          >
        </el-table-column>
        <el-table-column
          property="project.name"
          header-align="center"
          label="所属项目"
          >
        </el-table-column>  
        <el-table-column
          property="count"
          header-align="center"
          label="调用次数"
          >
        </el-table-column>
        <el-table-column
          property="update_time"
          header-align="center"
          :formatter="formatTime"
          label="最后一次调用时间">
        </el-table-column>
      </el-table>       
    </div>
    <div class="block">
      <el-pagination
        :page-size="10"
        @current-change="getRouters"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getRouters } from '../../api/member.js'
import { formatTime } from '../../utils/index.js'

export default {
  name: 'member_project',
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
    vm.getRouters(1)
  },
  methods: {
    getRouters (page) {
      const vm = this
      getRouters({id: vm.$route.query.userId, page, router: vm.value, proId: vm.$route.query.proId}).then(res => {
        if (res.data.status === 200) {
          vm.list = res.data.data.routers
          vm.count = res.data.data.count
        }
      })
    },
    // 格式化购买时间
    formatTime (row) {
      return formatTime(row.update_time / 1000, '{y}-{m}-{d} {h}:{m}:{s}')
    },
    // 模糊搜索
    fuzzySearch () {
      const vm = this
      vm.getRouters(1)
    }
  }
}
</script>

<style scoped>
#memberProject {
  width: 1200px;
  margin: 40px auto;
  text-align: center;
}
#memberProject .header{
  text-align: left;
}
#memberProject .header .el-input, #memberProject .header .el-select{
  width: 200px;
  margin-right: 100px;
}
#memberProject .list {
  margin-top: 30px;
  height: 560px;  
}
#memberProject .block {
  margin: 20px;
}
#memberProject .user-reply{
  margin-bottom: 20px;
  line-height: 28px;
}
#memberProject .user-reply span:last-child{
  display: inline-block;
  text-indent: 28px;
}
</style>

