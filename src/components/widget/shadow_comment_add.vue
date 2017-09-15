<template>
  <div id="addComment">
    <div class="line">
      <span class="title">项目名称：</span>
      <el-select v-model="proId" filterable placeholder="请选择">
        <el-option
          v-for="item in proList"
          :key="item._id"
          :label="item.name"
          :value="item._id">
        </el-option>
      </el-select>
    </div>
    <div class="line">
      <span class="title">项目名称：</span>
      <el-select v-model="userId" filterable placeholder="请选择">
        <el-option
          v-for="item in userList"
          :key="item._id"
          :label="item.name"
          :value="item._id">
        </el-option>
      </el-select>
      <el-button>添加用户</el-button>
    </div>
    <div class="line">
      <span class="title">是否购买：</span>
      <el-radio class="radio" v-model="radio" :label="true">购买</el-radio>
      <el-radio class="radio" v-model="radio" :label="false">未购买</el-radio>
    </div>
    <div class="line">
      <span class="title">评论内容：</span>
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10}"
        resize="none"
        placeholder="请输入评论"
        v-model="textarea">
      </el-input>
    </div>
    <div class="line" style="text-align: center">
      <el-button @click="addComment">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getProjectList } from '../../api/projects.js'
import { getMemberList } from '../../api/member.js'
import { addComment } from '../../api/shadow.js'
export default {
  name: 'shadow_comment_add',
  data () {
    return {
      proList: [],
      userList: [],
      radio: false,
      proId: '',
      userId: '',
      textarea: ''
    }
  },
  mounted () {
    const vm = this
    vm.getProjectList()
    vm.getMemberList()
  },
  methods: {
    getProjectList () {
      const vm = this
      getProjectList({limit: 0}).then(res => {
        if (res.data.status === 200) {
          vm.proList = res.data.data.projects
        }
      })
    },
    getMemberList () {
      const vm = this
      getMemberList({limit: 0}).then(res => {
        if (res.data.status === 200) {
          vm.userList = res.data.data.members
        }
      })
    },
    addComment () {
      const vm = this
      if (!vm.userId || !vm.proId || !vm.textarea) {
        return vm.$message({
          type: 'warning',
          message: '您未选择用户、项目或评论内容不全'
        })
      }
      addComment({uid: vm.userId, projId: vm.proId, content: vm.textarea, isBuy: vm.radio}).then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: '添加成功'
          })
          vm.userId = ''
          vm.proId = ''
          vm.textarea = ''
          vm.$emit('close')
        }
      })
    }
  }
}
</script>

<style scoped>
#addComment .line{
  line-height: 80px;
  font-size: 14px;
  text-align: left;  
}
#addComment .line span {
  display: inline-block;
}
#addComment .line .title {
  width: 120px;
  text-align: right;
}
#addComment .el-select {
  padding: 0 30px;
}
#addComment .el-textarea {
  width: 60%;
  padding: 0 30px;
}
#addComment .el-radio {
  padding: 0 40px;
}
</style>
