<template>
  <div id="addComment">
    <div class="line" v-if="power.has('project/query')">
      <span class="title">项目名称：</span>
      <el-select v-model="proId" filterable placeholder="请选择" @change="getShadowList">
        <el-option
          v-for="item in proList"
          :key="item._id"
          :label="item.name"
          :value="item._id">
        </el-option>
      </el-select>
    </div>
    <div class="line" v-if="power.has('member/list')">
      <span class="title">购买状态：</span>
      <el-select v-model="isbuy" placeholder="请选择" @change="userId = ''">
        <el-option label="已购买" value="true">
        </el-option>
        <el-option label="未购买" value="false">
        </el-option>
      </el-select>
    </div>
    <div class="line" v-if="power.has('member/list')">
      <span class="title">用户名称：</span>
      <el-select v-model="userId" filterable placeholder="请选择">
        <el-option
          v-for="item in userList"
          :key="item._id"
          v-if="item.isbuy.toString() === isbuy"
          :label="item.name"
          :value="item._id">
        </el-option>
      </el-select>
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
import { addComment, getShadowList } from '../../api/shadow.js'
export default {
  name: 'shadow_comment_add',
  data () {
    return {
      proList: [],
      userList: [],
      proId: '',
      userId: '',
      textarea: '',
      isbuy: 'false'
    }
  },
  mounted () {
    const vm = this
    vm.getProjectList()
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
    getShadowList (pid) {
      const vm = this
      getShadowList({page: 1, limit: 0}).then(res => {
        if (res.data.status === 200) {
          vm.userList = res.data.data.shadowUsers.map(user => {
            const obj = user.shadow_user
            // 默认选项
            // 判断是否购买项目
            obj.isbuy = false
            user.projects.map(project => {
              if (project._id === pid) {
                obj.isbuy = true
              }
            })
            return obj
          })
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
      if (vm.textarea.length > 150) {
        return vm.$message({
          type: 'warning',
          message: '评论内容过长'
        })
      }
      addComment({uid: vm.userId, projId: vm.proId, content: vm.textarea}).then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: '添加成功'
          })
          vm.userList.some(user => {
            if (user._id === vm.userId) {
              res.data.comment.user = { _id: res.data.comment.user, name: user.name }
            }
          })
          vm.proList.some(pro => {
            if (pro._id === vm.proId) {
              res.data.comment.project = { _id: res.data.comment.project, name: pro.name }
            }
          })
          vm.userId = ''
          vm.proId = ''
          vm.textarea = ''
          vm.$emit('close', res.data.comment)
        }
      })
    }
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
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
