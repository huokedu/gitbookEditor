<template>
  <div id='lineChart' ref="line"></div>
</template>

<script>
// 引入 ECharts 主模块
import echarts from 'echarts'
// 引入折线图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/legend'
export default {
  name: 'line_chart',
  props: ['list'],
  data () {
    return {
      options: {
        // Make gradient line here
        visualMap: [{
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 200,
          inRange: {
            color: ['rgba(29,144,230,.3)', 'rgba(29,144,230,1)'],
            symbolSize: [0, 10]
          }
        }, {
          show: false,
          type: 'continuous',
          seriesIndex: 1,
          min: 0,
          max: 200,
          inRange: {
            color: ['rgba(9,195,123,.3)', 'rgba(9,195,123,1)'],
            symbolSize: [0, 10]
          }
        }],
        title: [{
          left: 'center',
          text: '流量统计'
        }],
        color: ['#1d90e6', 'rgba(9,195,123,1)'],
        legend: {
          data: ['PV', 'UV'],
          x: '10%',
          y: '20%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: [{
          data: []
        }],
        yAxis: [{
          splitLine: {
            show: false
          }
        }],
        grid: [{
          left: '5%',
          right: '5%'
        }],
        series: [{
          name: 'PV',
          type: 'line',
          smooth: true,
          showSymbol: true,
          data: []
        }, {
          name: 'UV',
          type: 'line',
          smooth: true,
          showSymbol: true,
          data: []
        }]
      }
    }
  },
  methods: {
    drawLine () {
      const vm = this
      let myChart = echarts.init(vm.$refs.line)
      // 组合参数
      const uvList = []
      const pvList = []
      vm.options.xAxis[0].data = vm.list.map(value => {
        uvList.push(value.UV)
        pvList.push(value.PV)
        return value.create_time.slice(0, 10)
      })
      vm.options.series[0].data = pvList
      vm.options.series[1].data = uvList
      myChart.setOption(vm.options)
    }
  },
  watch: {
    list (val) {
      console.log(val)
      this.drawLine()
    }
  }
}
</script>

<style scoped>
#lineChart {
  width: 100%;
  height: 300px;
}
</style>
