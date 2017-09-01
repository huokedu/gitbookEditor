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
        <el-button @click="submitForm('partForm')">
          保存
        </el-button>
      </div>    
    </el-form>
</template>

<script>
export default {
  name: 'part_add',
  data () {
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入整数'))
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
        status: 'offline',
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
      }
    }
  },
  methods: {
    submitForm (formName) {
      const vm = this
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.$emit('addPart', vm.form)
        } else {
          console.log('error submit!!')
          return false
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
