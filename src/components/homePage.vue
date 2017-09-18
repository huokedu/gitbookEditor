<template>
  <div id="preview">
    <section class="general-data">
      <h2>首页</h2>
      <div class="general-content">
        <div class="header">
          <img src="" alt="">
          <el-button @click="$router.push('/repo/repo_add')">添加项目</el-button>
          <el-button @click="tabTo()">访问网站</el-button>
        </div>
        <div class="data">
          <ul>
            <li>
              <span><strong>{{generalData.proNum}}</strong>&nbsp;个<br><span>项目</span></span>
            </li>
            <li>
              <span><strong>{{generalData.userNum}}</strong>&nbsp;个<br><span>会员</span></span>
            </li>
            <li>
              <span><strong>{{generalData.orderNum}}</strong>&nbsp;笔<br><span>项目</span></span>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section class="today-data">
      <h2>今日实时</h2>
      <div class="today-content data">
        <ul>
          <li>
            <span><strong>{{generalData.newOrder}}</strong>&nbsp;笔<br><span>今日订单</span></span>
          </li>
          <li>
            <span><strong>{{generalData.newUser}}</strong>&nbsp;个<br><span>新增会员</span></span>
          </li>
          <li>
            <span><strong>{{PV}}</strong>&nbsp;次<br><span>今日浏览量(PV)</span></span>
          </li>
          <li>
            <span><strong>{{UV}}</strong>&nbsp;次<br><span>今日访客数(UV)</span></span>
          </li>
        </ul>
      </div>
    </section>
    <section class="trendency">
      <h2>流量趋势</h2>
      <line-chart :list="generalData.viewNum"></line-chart>
    </section>
  </div>
</template>

<script>
import { getGeneralData } from '../api/statistics.js'
import lineChart from './widget/line_chart'
import { mapState } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      generalData: {}
    }
  },
  mounted () {
    const vm = this
    if (vm.firstLogin) {
      vm.$message({
        type: 'success',
        message: `欢迎回来，${vm.name}`
      })
      vm.$store.commit('power/CHANGE_LOGIN', false)
    }
    vm.getGeneralData()
  },
  computed: {
    PV () {
      if (this.generalData.newView) return this.generalData.newView.PV
      return ''
    },
    UV () {
      if (this.generalData.newView) return this.generalData.newView.UV
      return ''
    },
    ...mapState('power', [
      'firstLogin', 'name'
    ])
  },
  methods: {
    tabTo () {
      window.open('http://www.baidu.com')
    },
    getGeneralData () {
      const vm = this
      getGeneralData().then(res => {
        if (res.data.status === 200) {
          vm.generalData = res.data.data
        }
      })
    }
  },
  components: {
    lineChart
  }
}
</script>

<style scoped>
 #preview {
  width: 1200px;
  margin: 40px auto;
 }
 #preview .header {
   line-height: 100px;
   padding: 0 25px;
   text-align: right;
   border-bottom: 1px solid #fff;
   background-color: #eef1f6;   
 }
 #preview .data {
   background-color: #eef1f6;
 }
 #preview .data ul {
   display: flex;
   margin: 0;
   padding: 0;
 }
 #preview .data li {
   box-sizing: border-box;
   display: inline-block;
   padding: 20px 0;
   text-align: center;
   width: 400px;
 }
 #preview .data li>span{
   display: inline-block;
   width: 100%;
   height: 80px;
   line-height: 40px;
   border-left: 1px solid #fff;
 }
 #preview .data strong {
   font-size: 28px;
   color: #1d90e6;
 }
</style>
