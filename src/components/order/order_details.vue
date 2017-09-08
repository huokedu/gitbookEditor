<template>
<div id="orderDetials">
   <div class="order title">
    <h2>订单信息</h2> <div class="bar"></div>
    <div class="order-content">
      <div class="line">
        <span class="title">订单编号：</span><span class="content">{{details._id}}</span>
      </div>
      <div class="line">
        <span class="title">下单时间：</span><span class="content">{{formatTime[0]}}&nbsp;&nbsp;&nbsp;{{formatTime[1]}}</span>
      </div>
      <div class="line">
        <span class="title">订单类型：</span><span class="content">{{orderType}}</span>
      </div>
      <div class="line">
        <span class="title">支付方式：</span><span class="content">{{details.payment === 'wechat' ? '微信支付' : '支付宝支付'}}</span>
      </div>
    </div>
  </div>
   <div class="user title">
    <h2>用户信息</h2> <div class="bar"></div>
    <div class="order-content">
      <div class="line">
        <span class="title">会员姓名：</span><span class="content">{{details.user ? details.user.name : ''}}</span>
      </div>
      <div class="line">
        <span class="title">手机号：</span><span class="content">{{details.user ? details.user.phone : ''}}</span>
      </div>
    </div>
  </div>
   <div class="repo title">
    <h2>项目详情</h2> <div class="bar"></div>
    <div class="order-content">
      <table>
        <thead>
          <tr>
            <th>项目名称</th>
            <th>套餐名称</th>
            <th>价格</th>
            <th>接口次数(次)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{details.project ? details.project.name : ''}}</td>
            <td>{{details.content ? details.content.name : ''}}</td>
            <td>{{details.price}}</td>
            <td>{{details.content ? details.content.count : ''}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import { getOrderDetails } from '../../api/projects.js'
import { formatTime } from '../../utils/index.js'
export default {
  name: 'order_details',
  data () {
    return {
      details: {}
    }
  },
  mounted () {
    const vm = this
    getOrderDetails({id: vm.$route.query._id}).then(res => {
      if (res.data.status === 200) {
        vm.details = res.data.data.order
      }
    })
  },
  computed: {
    formatTime () {
      const time = formatTime(this.details.update_time / 1000).split('日')
      return [time[0] + '日', time[1]]
    },
    orderType () {
      if (this.details.content) return this.details.content.trial ? '试用订单' : '正式订单'
      return ''
    }
  }
}
</script>

<style scoped>
  #orderDetials {
    margin: 80px auto;
    width: 1200px;
  }
  #orderDetials>.title {
    margin: 30px 0;
  }
  #orderDetials .title h2 {
    display: inline;
    vertical-align: middle;    
  }
  #orderDetials .title .bar {
     display: inline-block;
     margin-left: 20px;
     width: 1000px;
     height: 1px;
     background-color: #adadad;
     vertical-align: middle;
  }
  #orderDetials .line .title {
    display: inline-block;
    width: 120px;
  }
  #orderDetials .line {
    line-height: 50px;
  }
  #orderDetials .order-content{
    padding: 30px 30px 0;
  }
  table {
    width: 93%;
    line-height: 35px;
    text-align: center;
    border-color: red;
    border-collapse: collapse;

  }
  table th {
    background-color: #ededed;
  }
  table th, table td {
    border: 1px solid #666666;
  }
</style>
