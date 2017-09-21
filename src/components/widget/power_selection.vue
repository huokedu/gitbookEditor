<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllPowers">{{power._id}}</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="checkedPower" @change="handleCheckedPowersChange">
      <el-checkbox-button v-for="(name, index) in allPowers" :label="power.ids[index]" :key="name">{{name}}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'power_selection',
  props: ['power', 'ownPowerList'],
  data () {
    return {
      checkAll: false,
      checkedPower: [],
      allPowers: [],
      isIndeterminate: false,
      temPowers: [],
      weightList: {}
    }
  },
  mounted () {
    const vm = this
    vm.allPowers = vm.power.names
    vm.power.ids.map((power, index) => {
      vm.weightList[power] = vm.power.weights[index]
    })
    vm.checkOwnPower()
  },
  methods: {
    handleCheckAllPowers (event) {
      const vm = this
      vm.checkedPower = event.target.checked ? vm.power.ids : []
      vm.$store.commit(event.target.checked ? 'power/SELECTED_POWER' : 'power/DELETE_POWER', vm.power.ids)
      vm.temPowers = vm.checkedPower
      vm.isIndeterminate = false
    },
    handleCheckedPowersChange (value) {
      const vm = this
      // 根据权重选中低权重
      if (vm.temPowers.length > vm.checkedPower.length) {
        vm.checkPower()
      } else {
        vm.makePower(value[value.length - 1])
      }
      // 判断是否全选
      let checkedCount = vm.checkedPower.length
      vm.checkAll = checkedCount === vm.allPowers.length
      vm.isIndeterminate = checkedCount > 0 && checkedCount < vm.allPowers.length
    },
    // 检查拥有权限
    checkOwnPower () {
      const vm = this
      vm.ownPowerList.map(power => {
        if (vm.power._id === power.type) {
          vm.checkedPower.push(power._id)
        }
      })
      vm.$store.commit('power/SELECTED_POWER', vm.checkedPower)
      // 判断选中状态
      vm.temPowers = vm.checkedPower
      vm.checkAll = vm.allPowers.length === vm.checkedPower.length
      vm.isIndeterminate = !!vm.checkedPower.length && !vm.checkAll
    },
    checkPower () {
      const vm = this
      let set = new Set(vm.temPowers)
      vm.checkedPower.map(power => {
        set.delete(power)
      })
      const weight = vm.weightList[[...set][0]]
      const arr = []
      let delArr = []
      console.log(weight)
      if (weight < 4) {
        vm.allPowers.map((power, index) => {
          if (vm.power.weights[index] < weight) {
            arr.push(vm.power.ids[index])
          } else {
            if (vm.power.weights[index] === weight && new Set(vm.checkedPower).has(vm.power.ids[index])) {
              return arr.push(vm.power.ids[index])
            }
            delArr.push(vm.power.ids[index])
          }
        })
        vm.checkedPower = vm.temPowers = arr
      } else {
        delArr = [...set]
        vm.temPowers = vm.checkedPower
      }
      // 同步选中状态
      vm.$store.commit('power/DELETE_POWER', delArr)
    },
    makePower (value) {
      const vm = this
      // 高权重会同时选中低权重
      const weight = vm.weightList[value]
      vm.allPowers.map((name, index) => {
        // 同步选中id
        if (weight > 3) return
        if (vm.temPowers.length < vm.checkedPower.length && vm.power.weights[index] < weight) {
          vm.checkedPower.push(vm.power.ids[index])
        }
      })
      // 去重
      vm.temPowers = vm.checkedPower = [...new Set(vm.checkedPower)]
      // 同步选中状态
      vm.$store.commit('power/SELECTED_POWER', vm.checkedPower)
    }
  }
}
</script>

<style scoped>

</style>
