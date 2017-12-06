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
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/legend'
export default {
  name: 'line_chart',
  props: ['list', 'adsList'],
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
            color: ['#f16d6d'],
            symbolSize: [0, 10]
          }
        }, {
          show: false,
          type: 'continuous',
          seriesIndex: 1,
          min: 0,
          max: 200,
          inRange: {
            color: ['rgba(9,195,123,1)'],
            symbolSize: [0, 10]
          }
        }, {
          show: false,
          type: 'continuous',
          seriesIndex: 2,
          min: 0,
          max: 200,
          inRange: {
            color: ['#1d90e6'],
            symbolSize: [0, 10]
          }
        }, {
          show: false,
          type: 'continuous',
          seriesIndex: 3,
          min: 0,
          max: 200,
          inRange: {
            color: ['#9858f5'],
            symbolSize: [0, 10]
          }
        }
        ],
        title: [{
          left: 'center',
          text: ''
        }],
        color: ['#f16d6d', 'rgba(9,195,123,1)', '#1d90e6', '#9858f5'],
        legend: {
          data: ['总PV', '总UV', '广告PV', '广告UV'],
          x: '10%',
          y: '10%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 85,
            end: 100
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            start: 80,
            end: 100
          }
        ],
        xAxis: [{
          data: []
        }],
        yAxis: [
          {
            name: 'PV',
            type: 'value',
            splitLine: {
              show: false
            }
          },
          {
            name: 'UV',
            nameLocation: 'start',
            type: 'value',
            splitLine: {
              show: false
            }
          }
        ],
        grid: [{
          left: '5%',
          right: '5%'
        }],
        series: [
          {
            name: '总PV',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            showSymbol: true,
            data: []
          },
          {
            name: '总UV',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            showSymbol: true,
            data: []
          },
          {
            name: '广告PV',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            showSymbol: true,
            data: []
          }, {
            name: '广告UV',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            showSymbol: true,
            data: []
          }
        ]
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
      const adsUVList = []
      const adsPVList = []
      vm.options.xAxis[0].data = vm.list.map((value, index) => {
        uvList.push(value.UV)
        pvList.push(value.PV)
        adsUVList.push(vm.adsList[index].UV)
        adsPVList.push(vm.adsList[index].PV)
        return value._id
      })
      vm.options.series[0].data = pvList
      vm.options.series[1].data = uvList
      vm.options.series[2].data = adsPVList
      vm.options.series[3].data = adsUVList
      myChart.setOption(vm.options)
    }
  },
  watch: {
    list (val) {
      this.drawLine()
    }
  }
}
</script>

<style scoped>
#lineChart {
  width: 100%;
  height: 600px;
}
</style>
