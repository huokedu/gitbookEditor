<template>
<div id="userDetials">
  <div class="user title">
    <h2>用户信息</h2> <div class="bar"></div>
    <div class="user-content">
      <div class="line">
        <span class="title">用户头像</span><img class="content" :src="user.avatar | link"></img>
      </div>
      <div class="line">
        <span class="title">姓名：</span><span class="content">{{user.name}}</span>
      </div>
    </div>
  </div>
  <div class="comment title">
    <h2>项目信息</h2> <div class="bar"></div>
    <div class="user-content">
      <table>
        <thead>
          <tr>
            <th>项目名称</th>
            <th>评论内容</th>
            <th>回复内容</th>
            <th>评论时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in commentList" :key="comment._id">
            <td>{{comment.project.name}}</td>
            <td>{{comment.content}}</td>
            <td>{{comment.reply[0].content}}</td>
            <td>{{formatTime(comment.create_time)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="project title">
    <h2>评论信息</h2> <div class="bar"></div>
    <div class="user-content">
      <table>
        <thead>
          <tr>
            <th>项目名称</th>
            <th>项目状态</th>
            <th>购买状态</th>
            <th>购买时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pro in projectList" :key="pro._id">
            <td>{{pro.name}}</td>
            <td>{{pro.status === 'online' ? '已上架' : pro.status === 'pre' ? '预售' : '未上架'}}</td>
            <td>{{pro.hold ? '已购买' : '未购买'}}</td>
            <td>{{formatTime(pro.create_time)}}</td>
          </tr>
        </tbody>
      </table>`
    </div>
  </div>
</div>
</template>

<script>
import { formatTime } from '../../utils/index.js'
import { getShadowUserDetails } from '../../api/shadow.js'
export default {
  name: 'order_details',
  data () {
    return {
      commentList: [],
      projectList: [],
      user: {}
    }
  },
  mounted () {
    const vm = this
    const id = vm.$route.query.id
    getShadowUserDetails({id})
    .then(res => {
      if (res.data.status === 200) {
        vm.commentList = res.data.data.comments
        vm.projectList = res.data.data.ownPro
        vm.user = res.data.data.user
      } else {
        vm.$message({
          type: 'error',
          message: res.data.message
        })
      }
    })
  },
  methods: {
    formatTime (createTime) {
      const time = createTime ? formatTime(createTime / 1000) : 'N/A'
      return createTime ? time : 'N/A'
    }
  },
  computed: {
    orderType () {
      if (this.details.content) return this.details.content.trial ? '试用订单' : '正式订单'
      return ''
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  }
}
</script>

<style scoped>
  #userDetials {
    margin: 80px auto;
    width: 1200px;
  }
  #userDetials>.title {
    margin: 30px 0;
  }
  #userDetials .title h2 {
    display: inline;
    vertical-align: middle;    
  }
  #userDetials .title .bar {
     display: inline-block;
     margin-left: 20px;
     width: 1000px;
     height: 1px;
     background-color: #adadad;
     vertical-align: middle;
  }
  #userDetials .line .title {
    display: inline-block;
    width: 120px;
  }
  #userDetials .line .content {
     vertical-align: middle;
     border-radius: 50%;
  }
  #userDetials .line {
    display: inline-block;
    width: 45%;
    line-height: 50px;
  }
  #userDetials .user-content{
    padding: 30px 30px 0;
  }
  table {
    width: 1060px;
    line-height: 35px;
    text-align: center;
    border-collapse: collapse;
    word-wrap: break-word; 
    word-break: break-all;
  }
  table th {
    background-color: #ededed;
  }
  table th, table td {
    width: 50px;
    border: 1px solid #666666;
  }
</style>
