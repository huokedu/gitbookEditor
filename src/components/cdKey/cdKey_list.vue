<template>
  <div id="orderList">
    <div class="header">
      <span>兑换码：</span>
      <el-input
        placeholder="请输入兑换码"
        v-model="cdkey"
        @keyup.enter.native="keySearch"
        :on-icon-click="keySearch"
        icon="search"
        >
      </el-input>
      <span>会员：</span>
      <el-input
        placeholder="请输入会员名称"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        v-model="username"
        icon="search"
        >
      </el-input>
      <span>状态：</span>
      <el-select 
      v-model="status"
      @change="fuzzySearch"      
      placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
          property="key"
          header-align="center"
          label="兑换码"
          >
        </el-table-column>
        <el-table-column
          property="status"
          header-align="center"
          :formatter="formatStatus"
          label="状态">
        </el-table-column>
        <el-table-column
          property="share_user.name"
          header-align="center"
          label="分享会员">
        </el-table-column>
        <el-table-column
          property="life"
          header-align="center"
          :formatter="formatTime"
          label="有效期">
        </el-table-column>
        <el-table-column
          property="user.name"
          header-align="center"
          label="所属会员">
        </el-table-column>
      </el-table>       
    </div>
    <div class="block">
      <el-pagination
        :page-size="10"
        @current-change="getCdkeyList"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getCdkeyList } from '../../api/cdkey.js'
import { formatTime } from '../../utils/index.js'
export default {
  name: 'order_lsit',
  data () {
    return {
      options: [
        {
          value: '',
          label: '所有兑换码'
        },
        {
          value: true,
          label: '已使用'
        },
        {
          value: false,
          label: '未使用'
        }
      ],
      username: '',
      currentPage: 1,
      cdkey: '',
      count: 0,
      status: '',
      list: []
    }
  },
  mounted () {
    this.getCdkeyList(1)
  },
  methods: {
    getCdkeyList (page) {
      const vm = this
      getCdkeyList({page, name: vm.username, key: vm.cdkey, status: vm.status}).then(res => {
        if (res.data.status === 200) {
          vm.count = res.data.count
          vm.list = res.data.share
        }
      })
    },
    // 搜索
    // 格式化购买时间
    formatTime (row) {
      const timeRange = formatTime((row.life - 30 * 24 * 60 * 60 * 1000) / 1000, '{y}-{m}-{d}') + ' 至 ' + formatTime(row.life / 1000, '{y}-{m}-{d}')
      return row.life < Date.now() && !row.status ? timeRange + '(已失效)' : timeRange
    },
    formatStatus (row) {
      return row.status ? '已使用' : '未使用'
    },
    // 模糊搜索
    fuzzySearch () {
      const vm = this
      vm.currentPage = 1
      vm.getCdkeyList(1)
    },
    // 订单编号查询
    keySearch () {
      const vm = this
      vm.currentPage = 1
      vm.username = ''
      vm.getCdkeyList(1)
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
#orderList {
  width: 1200px;
  margin: 40px auto;
  text-align: center;
}
#orderList .header .el-input, #orderList .header .el-select{
  width: 200px;
  margin-right: 100px;
}
#orderList .list {
  margin-top: 50px;
  height: 560px;  
}
#orderList .block {
  margin: 20px;
}
</style>
