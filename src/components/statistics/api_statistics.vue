<template>
  <div id="APIStatistics">
    <div class="header">
      <span>项目名称：</span>
      <el-input
        placeholder="来呀"
        v-model="proName"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        icon="search"
        >
      </el-input>
      <span>接口名称：</span>
      <el-input
        placeholder="来呀"
        v-model="router"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        icon="search"
        >
      </el-input>
      <span class="demonstration">时间段：</span>
      <el-date-picker
        v-model="time"
        type="daterange"
        @change="fuzzySearch"
        placeholder="选择日期范围">
      </el-date-picker>
    </div>
      <div class="list">
        <el-table
          ref="List"
          border
          :data="apis"
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
            property="router"
            header-align="center"
            label="接口地址"
            >
          </el-table-column>
          <el-table-column
            property="count"
            header-align="center"
            label="调用次数">
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
  name: 'api_statistics',
  data () {
    return {
      apis: [],
      count: 0,
      proName: '',
      router: '',
      time: '',
      currentPage: 1,
      start: '',
      end: ''
    }
  },
  mounted () {
    const vm = this
    vm.getRouters(1)
  },
  methods: {
    getRouters (page, start, end) {
      const vm = this
      getRouters({page, proName: vm.proName, router: vm.router, start: vm.start, end: vm.end}).then(res => {
        if (res.data.status === 200) {
          vm.apis = res.data.data.routers
          vm.count = res.data.data.count
        }
      })
    },
    fuzzySearch () {
      const vm = this
      vm.currentPage = 1
      if (vm.time.length === 2) {
        vm.start = Date.parse(vm.time[0])
        vm.end = Date.parse(vm.time[1])
      }
      vm.getRouters(1)
    },
    // 格式化时间
    formatTime (row) {
      return formatTime(row.update_time / 1000, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  }
}
</script>

<style scoped>
#APIStatistics {
  width: 1200px;
  margin: 40px auto;
  text-align: center;
}
#APIStatistics .header, #APIStatistics .block{
  margin: 40px 0;
}
#APIStatistics .header .el-input, #APIStatistics .header .el-select{
  width: 200px;
  margin-right: 100px;
}
#APIStatistics .list {
  height: 450px;
}
</style>