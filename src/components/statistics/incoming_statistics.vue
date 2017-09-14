<template>
  <div id="incomingStatistics">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="日汇总" name="date">
        <p>
          <span>收入合计：&yen; {{allIncoming}}</span>
          <span>总订单数： {{counts}}</span>
        </p>
        <el-table
          :data="incoming"
          border
          style="width: 100%">
          <el-table-column
            prop="_id"
            label="日期"
            header-align="center"
            align="center"
           >
          </el-table-column>
          <el-table-column
            prop="count"
            label="订单量"
            header-align="center"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="eachPrice"
            :formatter="formatPrice"
            label="收入总额"
            header-align="center"
            align="center"
            >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="月汇总" name="month">
        <p>
          
          <span>收入合计：&yen; {{allIncoming}}</span>
          <span>总订单数：{{counts}}</span>
        </p>
        <el-table
          :data="incoming"
          border
          style="width: 100%">
          <el-table-column
            prop="_id"
            label="日期"
            header-align="center"
            align="center"
           >
          </el-table-column>
          <el-table-column
            prop="count"
            label="订单量"
            header-align="center"
            align="center"
            >
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="收入总额"
            :formatter="formatPrice"
            header-align="center"
            align="center"
            >
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div class="select-time">
      <div v-if="activeName === 'month'" class="block">
        <span class="demonstration">年</span>
        <el-date-picker
          v-model="year"
          align="right"
          type="year"
          placeholder="选择年">
        </el-date-picker>
      </div>
      <div v-if="activeName === 'date'" class="block">
        <span class="demonstration">月</span>
        <el-date-picker
          v-model="month"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import { getIncomings } from '../../api/statistics.js'
export default {
  name: 'incoming_statistics',
  data () {
    return {
      activeName: 'date',
      allIncoming: 0,
      counts: 0,
      incoming: [],
      page: 1,
      month: new Date(),
      year: new Date()
    }
  },
  mounted () {
    const vm = this
    vm.getIncomings(vm.fullMonth)
  },
  methods: {
    getIncomings (month) {
      const vm = this
      getIncomings({year: vm.fullYear, month, page: vm.page}).then(res => {
        if (res.data.status === 200) {
          vm.incoming = res.data.data.incomes
          vm.allIncoming = res.data.data.total ? res.data.data.total.totalPrice : 0
          vm.counts = res.data.data.total ? res.data.data.total.count : 0
        }
      })
    },
    handleClick () {
      const vm = this
      // 重置时间
      vm.month = new Date()
      vm.year = new Date()
      if (vm.activeName === 'month') return vm.getIncomings()
      vm.getIncomings(vm.fullMonth)
    },
    formatPrice (row) {
      return row.eachPrice.toFixed(2)
    },
    changeDate () {
      console.log(...arguments)
    }
  },
  computed: {
    fullMonth () {
      if (!this.month) return new Date().getMonth() + 1
      return this.month.getMonth() + 1
    },
    fullYear () {
      if (!this.year) return new Date().getFullYear()
      return this.year.getFullYear()
    }
  },
  watch: {
    fullYear () {
      const vm = this
      if (vm.activeName === 'month') return vm.getIncomings()
      vm.getIncomings(vm.fullMonth)
    },
    fullMonth () {
      const vm = this
      if (vm.activeName === 'month') return vm.getIncomings()
      vm.getIncomings(vm.fullMonth)
    }
  }
}
</script>

<style scoped>
#incomingStatistics {
  margin: 50px auto;
  position: relative;
  width: 1200px;
}
#incomingStatistics .select-time {
  position: absolute;
  top: 3px;
  left: 180px;
}
#incomingStatistics .select-time .block{
  display: inline-block;
  margin: 0 20px;
}
</style>
