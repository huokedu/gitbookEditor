<template>
  <div id="commentList">
    <div class="header">
      <span>项目名称：</span>
      <el-input
        placeholder="来呀"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        v-model="proName"
        icon="search"
        >
      </el-input>
      <span>用户名称：</span>
      <el-input
        placeholder="来呀"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        v-model="userName"
        icon="search"
        >
      </el-input>
      <el-button @click="addVisible = true" v-if="power.has('shadow/generate/comment')">添加评论</el-button>
    </div>
    <div class="list">
      <el-table
        ref="List"
        border
        :data="list"
       >
        <el-table-column
          type="index"
          header-align="center"
          label="序号"
          width="65"
          >
        </el-table-column>
        <el-table-column
          property="user.name"
          header-align="center"
          label="会员名称"
          >
        </el-table-column>
        <el-table-column
          property="hold"
          :formatter="formatState"
          header-align="center"
          label="所属项目"
          >
        </el-table-column>
        <el-table-column
          property="content"
          header-align="center"
          label="评论内容"
          >
        </el-table-column>  
        <el-table-column
          property="update_time"
          header-align="center"
          :formatter="formatTime"
          label="评论时间">
        </el-table-column>
        <el-table-column
          property="project.name"
          header-align="center"
          label="所属项目"
          >
        </el-table-column>
        <el-table-column
          v-if="power.has('project/comment/set')"
          label="操作"
          header-align="center"
          width="200">
          <template scope="scope">
            <el-button
              v-if="scope.row.state === 'wait'"
              @click.native.prevent="openReplyBox(scope.row)"
              type="text"
              size="small">
              修改评论内容
            </el-button>
            <el-button
              v-else
              disabled
              type="text"
              size="small">
              {{scope.row.state === 'passed' ? '已审核通过' : '审核未通过'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>       
    </div>
    <div class="block">
      <el-pagination
        :page-size="10"
        @current-change="getComments"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next"
        :total="count">
      </el-pagination>
    </div>
    <el-dialog
      style="text-align: left"
      title="回复评论"
      :visible.sync="dialogVisible"
      size="tiny"
      @close="textarea = ''"
      >
      <div class="user-reply">
        <span>{{user}}：</span>
        <span>{{content}}</span>
      </div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 10}"
        resize="none"
        autofocus
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="replyComment">回复</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addVisible"
      >
      <reply-comment @close="addVisible = false" :user="addUser"></reply-comment>
    </el-dialog>
  </div>
</template>
<script>
import { getComments, addComment } from '../../api/comments.js'
import { formatTime } from '../../utils/index.js'
import replyComment from '../widget/shadow_comment_add'
export default {
  name: 'order_lsit',
  data () {
    return {
      proName: '',
      userName: '',
      currentPage: 1,
      count: 0,
      list: [],
      id: '',
      user: '',
      content: '',
      dialogVisible: false,
      addVisible: false,
      textarea: '',
      addUser: {},
      userId: ''
    }
  },
  mounted () {
    this.getComments(1)
  },
  methods: {
    getComments (page) {
      const vm = this
      getComments({page, project: vm.proName, user: vm.userName, shadow: true}).then(res => {
        if (res.data.status === 200) {
          vm.count = res.data.data.count
          vm.list = res.data.data.comments
        }
      })
    },
    // 格式化购买时间
    formatTime (row) {
      return formatTime(row.update_time / 1000, '{y}-{m}-{d} {h}:{i}')
    },
    // 格式化订单类型
    formatState (row) {
      return row.hold ? '已购买' : '未购买'
    },
    // 评论状态搜索
    commentChange () {
      const vm = this
      vm.proName = ''
      vm.getComments(1)
    },
    // 模糊搜索
    fuzzySearch () {
      const vm = this
      vm.currentPage = 1
      vm.getComments(1)
    },
    openReplyBox (row) {
      const vm = this
      vm.dialogVisible = true
      vm.user = row.user.name
      vm.content = row.content
      vm.id = row._id
      vm.userId = row.user._id
    },
    // 回复评论
    replyComment () {
      const vm = this
      if (vm.textarea === '') {
        return vm.$message({
          type: 'warning',
          message: '回复内容不能为空'
        })
      }
      addComment({commentId: vm.id, content: vm.textarea, userId: vm.userId}).then(res => {
        if (res.data.status === 200) {
          vm.textarea = ''
          vm.dialogVisible = false
          // 显示已回复
          vm.list[vm.selectedIndex].reply = [1]
          vm.$message({
            type: 'success',
            message: '回复成功'
          })
        }
      })
    }
  },
  components: {
    replyComment
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  }
}
</script>

<style scoped>
#commentList {
  width: 1200px;
  margin: 40px auto;
  text-align: center;
}
#commentList .header .el-input, #commentList .header .el-select{
  width: 200px;
  margin-right: 100px;
}
#commentList .list {
  margin-top: 50px;
  height: 560px;  
}
#commentList .block {
  margin: 20px;
}
#commentList .user-reply{
  margin-bottom: 20px;
  line-height: 28px;
}
#commentList .user-reply span:last-child{
  display: inline-block;
  text-indent: 28px;
}
</style>
