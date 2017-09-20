<template>
  <div id="powerEdit">
    <div class="power" v-for="power in powerList" :key="power._id">
      <power-sel :power="power" :ownPowerList="ownPowerList"></power-sel>
    </div>
    <div class="handdle">
      <el-button @click="editPower">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getPowerList, getUserPower, editPower } from '../../api/power.js'
import powerSel from '../widget/power_selection'
export default {
  name: 'power_edit',
  data () {
    return {
      powerList: [],
      ownPowerList: []
    }
  },
  mounted () {
    this.getPowerList()
  },
  methods: {
    // 获取权限列表
    getPowerList () {
      const vm = this
      Promise.all([getPowerList(), getUserPower(vm.$route.query.id)]).then(res => {
        if (res[0].data.status === 200 && res[1].data.status === 200) {
          vm.powerList = res[0].data.data.powers
          vm.ownPowerList = res[1].data.data.powers
        }
      })
    },
    // 编辑权限
    editPower () {
      const vm = this
      editPower({uid: vm.$route.query.id, ids: vm.$store.state.power.selectedPower})
      .then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
    }
  },
  components: {
    powerSel
  }
}
</script>

<style scoped>
 #powerEdit {
  width: 1200px;
  margin: 60px auto;
 }
 #powerEdit .power {
   margin: 20px;
 }
  #powerEdit .handdle {
    text-align: center;
  }
</style>
