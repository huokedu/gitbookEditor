<template>
    <el-form :model="form" label-position="right" label-width="30%" :rules="rules" ref="partForm">
    <el-form-item label="套餐名称:" prop="name">
      <el-input v-model="form.name" ></el-input>
    </el-form-item>
    <el-form-item label="接口次数:" prop="count">
      <el-input v-model.number="form.count" ></el-input>
    </el-form-item>
    <el-form-item label="销售价格:" prop="price">
      <el-input v-model.number="form.price" ></el-input>
    </el-form-item>
      <div class="handdle">
        <el-button @click="checkStatus">
          保存
        </el-button>
      </div>    
    </el-form>
</template>

<script>
import { addPart, editPart } from '../../api/projects.js'
export default {
  name: 'part_add',
  props: ['part', 'ProId', 'partId', 'parts'],
  data () {
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'))
      }
      setTimeout(() => {
        console.log(value)
        if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      form: {
        name: '',
        count: '',
        price: '',
        status: false,
        trial: false
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        count: [
          { validator: checkNum, trigger: 'blur' }
        ],
        price: [
          { validator: checkNum, trigger: 'blur' }
        ]
      },
      status: 'add'
    }
  },
  mounted () {
    const vm = this
    if (vm.part) {
      vm.form = vm.part
      vm.status = 'edit'
    }
  },
  methods: {
    checkStatus () {
      const vm = this
      const isDuplicate = vm.parts.some((savedPart, index) => {
        if (savedPart._id === vm.partId) return false
        return savedPart.name === vm.form.name
      })
      // 检查标题重复
      if (isDuplicate) {
        return vm.$message({
          type: 'warning',
          message: '套餐名重复'
        })
      }
      if (vm.status === 'add') vm.addPart()
      if (vm.status === 'edit') vm.editPart()
    },
    // 添加套餐
    addPart () {
      const vm = this
      vm.form.id = vm.ProId
      vm.form.salePrice = vm.form.price
      // 添加套餐
      addPart(vm.form).then(res => {
        if (res.data.status === 200) {
          vm.form._id = res.data.id
          delete vm.form.id
          vm.$emit('addPart', vm.form)
          return vm.$message({
            type: 'success',
            message: '添加套餐成功'
          })
        } else {
          vm.$message({
            type: 'error',
            message: '保存失败'
          })
        }
      })
    },
    editPart () {
      const vm = this
      vm.form.id = vm.partId
      vm.form.salePrice = vm.form.price
      return editPart(vm.form).then(res => {
        if (res.data.status === 200) {
          vm.form._id = vm.form.id
          delete vm.form.id
          vm.$emit('addPart', vm.form)
          vm.$message({
            type: 'success',
            message: '编辑套餐成功'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-dialog__header, .handdle{
  text-align: center;
}

</style>