<template>
  <div id="commentList">
    <div class="header">
      <span>评论状态：</span>
      <el-select 
      v-model="value"
      @change="getComments(1)"      
      placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span>项目名称：</span>
      <el-input
        placeholder="来呀"
        @keyup.enter.native="fuzzySearch"
        :on-icon-click="fuzzySearch"
        v-model="proName"
        icon="search"
        >
      </el-input>
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
          property="state"
          header-align="center"
          :formatter="formatState"
          label="状态"
          >
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
            <el-button v-if="scope.row.state === 'wait'"
              @click.native.prevent="setComment(scope.row, 'passed')"
              type="text"
              size="small">
              通过
            </el-button>
            <el-button v-if="scope.row.state === 'wait'"
              @click.native.prevent="setComment(scope.row, 'unpassed')"
              type="text"
              size="small">
              不通过
            </el-button>
            <el-button
              @click.native.prevent="openReplyBox(scope.row)"
              type="text"
              size="small">
              回复
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
  </div>
</template>
<script>
import { getComments, setComment } from '../../api/comments.js'
import { formatTime } from '../../utils/index.js'
export default {
  name: 'order_lsit',
  data () {
    return {
      options: [
        {
          value: '',
          label: '所有评论'
        },
        {
          value: 'wait',
          label: '待审核'
        },
        {
          value: 'unpassed',
          label: '审核未通过'
        },
        {
          value: 'passed',
          label: '审核通过'
        }
      ],
      proName: '',
      value: '',
      currentPage: 1,
      count: 0,
      list: [],
      id: '',
      user: '',
      content: '',
      dialogVisible: false,
      textarea: ''
    }
  },
  mounted () {
    this.getComments(1)
  },
  methods: {
    getComments (page) {
      const vm = this
      getComments({page, state: vm.value, project: vm.proName}).then(res => {
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
      if (row.state === 'wait') return '待审核'
      if (row.state === 'passed') return '审核通过'
      return '审核不通过'
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
      vm.getComments(1)
    },
    // 审核评论
    setComment (row, state) {
      const vm = this
      let message = ''
      message = state === 'passed' ? '审核通过的评论将显示在项目评论中, 是否继续?' : '审核不通过的评论不会显示在项目评论中, 是否继续?'
      vm.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row._id
        setComment({id, state}).then(res => {
          if (res.data.status === 200) {
            row.state = state
            vm.$message({
              type: 'success',
              message: '审核成功'
            })
          }
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    openReplyBox (row) {
      const vm = this
      vm.dialogVisible = true
      vm.user = row.user.name
      vm.content = row.content
      vm.id = row._id
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
      setComment({id: vm.id, reply: vm.textarea}).then(res => {
        if (res.data.status === 200) {
          vm.textarea = ''
          vm.dialogVisible = false
          vm.$message({
            type: 'success',
            message: '回复成功'
          })
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
