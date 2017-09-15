<template>
  <div id="ipStastics">
    <div id="map" ref="map"></div>
    <div class="list">
      <el-table
        ref="List"
        border
        :data="options.series[0].data"
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
          property="name"
          header-align="center"
          align="center"
          label="地区"
          >
        </el-table-column>
        <el-table-column
          property="value"
          header-align="center"
          align="center"
          label="会员数"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="300">
          <template scope="scope">
            <el-button
              @click.native.prevent="$router.push({path:'/statistics/ip_statistics/details', query: {region: scope.row.name}})"
              type="text"
              size="small">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入中国地图
import 'echarts/lib/chart/map'
import chinaJson from '../../assets/china.json'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/legend'

import { getIPs } from '../../api/statistics.js'
export default {
  name: 'ip_statistics',
  data () {
    return {
      options: {
        title: {
          text: 'IP统计',
          subtext: '最后一次登录信息',
          padding: [30, 0],
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          min: 0,
          max: 0,
          left: 'left',
          top: 'bottom',
          inRange: {
            color: ['#e0ffff', '#006edd']
          },
          text: ['高', '低'],           // 文本，默认为数值文本
          calculable: true
        },
        series: [
          {
            name: '发生的不能开了房间爱上',
            type: 'map',
            mapType: 'china',
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            data: [
            ]
          }
        ]
      }
    }
  },
  mounted () {
    this.drawMap()
  },
  methods: {
    drawMap () {
      let vm = this
      let myChart = echarts.init(vm.$refs.map)
      getIPs().then(res => {
        if (res.data.status === 200) {
          // 生成ip数据组
          let max = 0
          const ips = res.data.data.ips
          .filter(ip => { return ip._id !== '' && ip._id !== null })
          .map(ip => {
            max = ip.value > max ? ip.value : max
            let name = ip._id ? ip._id.split('省')[0] : ip._id
            name = name === '宁夏回族自治区' ? '宁夏' : name
            name = name === '新疆维吾尔自治区' ? '新疆' : name
            return {name, value: ip.value}
          })
          vm.options.series[0].data = ips
          vm.options.visualMap.max = max + 10
          echarts.registerMap('china', chinaJson)
          myChart.setOption(vm.options)
        }
      })
    }
  }
}
</script>

<style scoped>
#ipStastics {
  width: 1200px;
  margin: 20px auto 50px;
}
#map{
  display: inline-block;
  margin: 20px 0;
  width: 1200px;
  height: 800px;
}
</style>