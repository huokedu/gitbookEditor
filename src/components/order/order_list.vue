<template>
  <div id="orderList">
    <div class="header">
      <span>订单编号：</span>
      <el-input
        placeholder="来呀"
        v-model="orderId"
        @keyup.enter.native="getOrderList(1)"
        icon="search"
        >
      </el-input>
      <span>评论状态：</span>
      <el-select 
      v-model="value"
      @change="fuzzySearch"      
      placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span>会员名称：</span>
      <el-input
        placeholder="来呀"
        @keyup.enter.native="fuzzySearch"
        v-model="username"
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
          property="_id"
          header-align="center"
          label="订单编号"
          >
        </el-table-column>
        <el-table-column
          property="user.name"
          header-align="center"
          label="会员名称"
          >
        </el-table-column>
        <el-table-column
          property="user.phone"
          header-align="center"
          label="手机号">
        </el-table-column>  
        <el-table-column
          property="content.trial"
           :formatter="formatOrderType"
          header-align="center"
          label="订单类型">
        </el-table-column>
        <el-table-column
          property="price"
          header-align="center"
          label="价格">
        </el-table-column>
        <el-table-column
          property="payment"
          header-align="center"
          :formatter="formatPayType"
          label="支付方式">
        </el-table-column>
        <el-table-column
          property="update_time"
          header-align="center"
          :formatter="formatTime"
          label="支付时间">
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          width="120">
          <template scope="scope">
            <el-button
              @click.native.prevent="$router.push({path: '/order/order_details', query: {_id: scope.row._id}})"
              type="text"
              size="small">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>       
    </div>
    <div class="block">
      <el-pagination
        :page-size="10"
        @current-change="getOrderList"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getOrderList } from '../../api/projects.js'
import { formatTime } from '../../utils/index.js'
export default {
  name: 'order_lsit',
  data () {
    return {
      options: [
        {
          value: '',
          label: '所有订单'
        },
        {
          value: false,
          label: '试用订单'
        },
        {
          value: true,
          label: '正式订单'
        }
      ],
      orderId: '',
      username: '',
      value: '',
      currentPage: 1,
      count: 0,
      list: []
    }
  },
  mounted () {
    this.getOrderList(1)
  },
  methods: {
    getOrderList (page) {
      const vm = this
      getOrderList({page, username: vm.username, orderId: vm.orderId, isTrial: vm.value}).then(res => {
        if (res.data.status === 200) {
          vm.count = res.data.data.count
          vm.list = res.data.data.types
        }
      })
    },
    // 搜索
    // 格式化购买时间
    formatTime (row) {
      return formatTime(row.update_time / 1000).split('日')[0] + '日'
    },
    // 格式化订单类型
    formatOrderType (row) {
      return row.content.trial ? '正式订单' : '试用订单'
    },
    // 格式化支付方式
    formatPayType (row) {
      return row.payment === 'wechat' ? '微信' : '支付宝'
    },
    // 模糊搜索
    fuzzySearch () {
      const vm = this
      vm.orderId = ''
      vm.getOrderList(1)
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
