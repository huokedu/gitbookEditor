<template>
  <div id="ipDetails">
    <div id="map" ref="map"></div>
    <div class="list">
      <el-table
        ref="List"
        border
        :data="list"
      >
        <el-table-column
          type="index"
          header-align="center"
          align="center"
          label="排名"
          width="65"
          >
        </el-table-column>
        <el-table-column
          property="city"
          header-align="center"
          align="center"
          label="城市"
          >
        </el-table-column>
        <el-table-column
          property="user.name"
          header-align="center"
          align="center"
          label="会员名称"
          >
        </el-table-column>
        <el-table-column
          property="user.phone"
          header-align="center"
          align="center"
          label="手机号"
          >
        </el-table-column>
        <el-table-column
          property="update_time"
          header-align="center"
          align="center"
          :formatter="formatTime"
          label="最后一次登录时间"
          >
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :page-size="10"
          @current-change="getIPsDetails"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getIPsDetails } from '../../api/statistics.js'
import { formatTime } from '../../utils/index.js'

export default {
  name: 'ip_details',
  data () {
    return {
      list: [],
      count: 27
    }
  },
  mounted () {
    const vm = this
    vm.getIPsDetails()
  },
  methods: {
    getIPsDetails () {
      const vm = this
      getIPsDetails(vm.$route.query.region).then(res => {
        if (res.data.status === 200) {
          vm.list = res.data.data.users
          vm.count = res.data.data.users.length
        }
      })
    },
    // 格式化时间
    formatTime (row) {
      return formatTime(row.update_time / 1000, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  }
}
</script>

<style scoped>
#ipDetails {
  width: 1200px;
  margin: 50px auto;
}
#ipDetails .block {
  margin: 20px;
  text-align: center;
}
</style>

