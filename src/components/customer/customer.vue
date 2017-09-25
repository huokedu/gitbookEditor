<template>
  <div id="customer">
    <section class="left-msg-list">
      <el-tabs type="border-card">
        <el-tab-pane label="进行中">
          <div :class="[{selected: selected[index]},'box']"
          @click="changeUser(session.user._id, index)"
          v-for="(session, index) in sessions"
          :key="session._id"
          :title="session.user.user.name">
            <img src="/static/avatar.b988378.jpg" alt="">
            <el-badge :value="badge[index]" class="item">
              <span >
                {{session.user.user.name}}
              </span>
            </el-badge>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史记录">还没开发</el-tab-pane>
      </el-tabs>
    </section>
    <section class="right-msg-box">
      <h2>{{selectedName}}</h2>
      <div  class="chat-section" ref="chat" v-loading.body="loading">
        <transition-group name=msg-display>
          <div v-for="(info, index) in msgList" :class="info.class" :key="index">
            <div v-if="!info.end" class="time">{{formatTime(info.time)}}</div>                        
            <div class="end" v-if="info.end">没有更多了～～～</div>
            <span v-else><img :src="info.user && info.user.avatar || '/static/avatar.b988378.jpg'" alt=""></span>
            <p v-if="!info.end">{{info.body}}</p>
          </div>
        </transition-group>    
        
      </div>
      <div class="send">
        <textarea v-model="msg" placeholder="意见..." @keyup.alt.enter="sendMessage('user')"></textarea>
      </div>
      <div class="handdle">
        <el-button size="small" @click="sendMessage" :disabled="msg.length === 0">发送</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import '../../utils/nedb.min.js'
import { client } from '../../utils/connect.js'
import { formatTime } from '../../utils/index.js'
export default {
  name: 'chat',
  data () {
    return {
      isChat: false,
      msg: '',
      msgIndex: 0,
      online: false,
      db: null,
      latest_id: '',
      skip: 10,
      link: '',
      id: '',
      startTime: 0,
      failure: false,
      to: '',
      from: '',
      selected: [],
      selectedName: '',
      loading: false,
      badge: []
    }
  },
  mounted () {
    let vm = this
    vm.db = new window.Nedb({ filename: 'path/Chat', autoload: true }) // Create an in-memory only datastore
    vm.$refs.chat.addEventListener('scroll', vm.loadHistory)
    setTimeout(vm.webChat, 2000)
  },
  methods: {
    async sendMessage (id) {
      // 过滤用户输入内容
      function SaferHTML (templateData) {
        let s = templateData[0]
        for (var i = 1; i < arguments.length; i++) {
          var arg = String(arguments[i])
          // Escape special characters in the substitution.
          s += arg.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
          // Don't escape special characters in the template
          s += templateData[i]
        }
        return s
      }
      let vm = this
      vm.msg = SaferHTML`${vm.msg}`
      // 获取最后一次聊天客服信息
      let msgContent
      vm.db.findOne({_id: vm.latest_id}, function (err, docs) {
        if (err) return
        msgContent = {
          to: vm.to,
          from: vm.from,
          type: 'text',
          time: new Date(),
          body: vm.msg
        }
        // 发送消息
        client.send(msgContent)
        msgContent.class = 'user'
        msgContent.user = {}
        msgContent.user.avatar = vm.$store.state.power.avatar
        msgContent.user.name = vm.$store.state.power.name
        vm.db.insert(msgContent, function (err, docs) {
          if (err) return
          vm.$store.commit('message/GET_MESSAGE', [docs])
          vm.msg = ''
          let ele = vm.$refs.chat
          setTimeout(function () {
            ele.scrollTop = ele.scrollHeight - 10
          }, 0)
        })
      })
    },
    // 建立链接监听聊天事件
    webChat () {
      let vm = this
      // 选中状态处理
      vm.selected.length = vm.badge.length = vm.sessions.length
      if (!client.connected) {
        vm.$message({
          type: 'error',
          message: '客服系统链接失败，刷新页面重试'
        })
        return
      }
      if (vm.sessions.length) {
        // 保存客服id
        vm.from = vm.sessions[0].admin
      }
      client.emit('message-offline', '', (data) => {
        if (vm.msgList.length) return
        vm.db.insert(data, function (err, docs) {
          if (err || !docs.data.messages.length) return
          vm.$store.commit('message/GET_MESSAGE', docs.data.messages)
          let ele = vm.$refs.chat
          setTimeout(function () {
            ele.scrollTop = ele.scrollHeight - 10
          }, 0)
        })
      })
      client.on('message', (msg) => {
        // 收到消息
        console.log(msg)
        if (msg.type === 'online') {
          client.send({
            to: msg.from,
            from: msg.to,
            body: '您好',
            time: Date.now(),
            type: 'text'
          })
        }
        client.emit('vcard', msg.from, (data) => {
          console.log(data)
          msg.user = data.data.vcard.user
          msg.class = 'custom-service'
          // 重置消息时间
          msg.time = new Date()
          // 将客服信息获取后插入数据库
          vm.db.insert(msg, function (err, docs) {
            if (err) return
            vm.latest_id = docs._id
            // 不在当前用户聊天窗口时提示
            if (msg.from !== vm.to) {
              const isNewUser = vm.sessions.every((session, index) => {
                if (session.user._id === msg.from) {
                  // 添加消息标记
                  const value = !vm.badge[index] ? 1 : vm.badge[index] + 1
                  vm.badge.splice(index, 1, value)
                  return false
                }
                return true
              })
              // 新用户提示
              if (isNewUser) {
                const user = msg.user
                msg.user = {}
                msg.user._id = msg.from
                msg.admin = vm.from = msg.to
                msg.user.user = user
                // 将选中状态下移一位匹配用户
                let index = 0
                vm.selected = vm.selected.map((s, inx) => {
                  if (s) index = inx + 1
                  return false
                })
                vm.selected[vm.selected.length] = false
                if (index) vm.selected.splice(index, 1, true)
                vm.$store.commit('message/GET_SESSION', [msg, ...vm.sessions])
                // 添加消息标记
                vm.badge.unshift(1)
              }
              return
            }
            vm.$store.commit('message/GET_MESSAGE', [docs])
            let ele = vm.$refs.chat
            setTimeout(function () {
              ele.scrollTop = ele.scrollHeight - 10
            }, 0)
          })
        })
      })
    },
    // 初始化数据库
    initDB (id) {
      const vm = this
      // 获取用户id
      vm.to = id
      vm.loading = true
      vm.db.find({$or: [{from: id}, {to: id}]}).sort({time: -1}).limit(9).exec(function (err, docs) {
        if (err) return
        vm.$store.commit('message/COMBINE_MESSAGE', docs.reverse())
        let ele = vm.$refs.chat
        setTimeout(function () {
          ele.scrollTop = ele.scrollHeight - 10
        }, 0)
        setTimeout(() => {
          vm.loading = false
        }, 500)
      })
    },
    // 加载更多历史
    loadHistory (event) {
      let vm = this
      if (event.target.scrollTop === 0) {
        vm.db.find({$or: [{from: vm.to}, {to: vm.to}]}).sort({time: -1}).skip(vm.skip).limit(10).exec(function (err, docs) {
          if (err) return
          console.log(docs)
          if (!docs.length) {
            if (vm.msgList[0].end) return
            vm.$store.commit('message/END_MESSAGE')
          }
          vm.$store.commit('message/COMBINE_MESSAGE', [...docs.reverse(), ...vm.msgList])
          vm.skip += 10
          setTimeout(function () {
            event.target.scrollTop = 500
          }, 0)
        })
      }
    },
    changeUser (id, index) {
      const vm = this
      if (id === vm.to) return
      vm.selected = vm.selected.map(s => false)
      vm.selected.splice(index, 1, true)
      vm.badge.splice(index, 1, 0)
      vm.selectedName = vm.sessions[index].user.user.name
      vm.initDB(id)
    },
    // 格式化时间
    formatTime (time) {
      time = typeof time === 'number' ? time : Date.parse(time)
      return formatTime(time / 1000, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  computed: {
    msgList () {
      return this.$store.state.message.msgList
    },
    sessions () {
      return this.$store.state.message.sessions
    }
  }
}
</script>

<style scoped>
#customer {
  width: 1200px;
  height: 700px;      
  margin: 40px auto;
}
#customer .left-msg-list {
  display: inline-block;
  width: 164px;
  height: 100%;
  vertical-align: top;
}
#customer .time {
  line-height: 0px;
}
#customer .el-tabs{
  height: 100%;
  overflow: auto;
}
#customer .left-msg-list .box {
  height: 60px;
  margin: 0 -15px;
  padding-left: 8px;
  cursor: pointer;
}
#customer .box img {
  display: inline-block;
  margin: 10px 0 0;
  height: 35px;
  width: 35px;
  vertical-align: middle;
}
#customer .box span {
  display: inline-block;
  width: 90px;
  margin-top: 13px;
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#customer .box:hover, #customer .box.selected {
  background-color: #adadad;
  color: #fff;
}
#customer .right-msg-box {
  display: inline-block;  
  width: 980px;
  height: 100%;
  border: 1px solid #d1dbe5;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
#customer .right-msg-box h2 {
  margin: 0;
  height: 60px;
  line-height: 60px;
  text-indent: 20px;
  border-bottom: 1px solid #d1dbe5;
}
#customer .chat-section {
  height: 450px;
  border-bottom: 1px solid #d1dbe5;
  overflow: auto;
}
#customer .send {
  height: 118px;
}
#customer .send textarea{
  box-sizing: border-box;
  padding: 20px 10px;
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
}
#customer .send textarea::-webkit-scrollbar, #customer .chat-section::-webkit-scrollbar, #customer .el-tabs::-webkit-scrollbar{
  width:6px;
}
#customer .send textarea::-webkit-scrollbar-thumb, #customer .chat-section::-webkit-scrollbar-thumb, #customer .el-tabs::-webkit-scrollbar-thumb{
  border-radius: 5px;
  height:20px;
  background:#d1dbe5;
}
#customer .send textarea::-webkit-scrollbar-thumb:hover, #customer .chat-section::-webkit-scrollbar-thumb:hover, #customer .el-tabs::-webkit-scrollbar-thumb:hover{
  cursor:pointer
}
#customer .handdle {
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  text-align: right;
}
#customer .handdle .el-button {
  width: 80px;
}
#customer .chat-section {
  padding: 20px;
}
#customer .chat-section .user {
  text-align: right;
  height: 70px;
  line-height: 70px;
}
#customer .chat-section .custom-service {
  height: 70px;
  line-height: 70px;
}
#customer .chat-section .user img {
  float: right;
  margin-top: 13px;
}

#customer .chat-section img {
  width: 36px;
  height: 36px;
  vertical-align: middle;
}
#customer .chat-section p {
  position: relative;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  background-color: #20a0ff;
  vertical-align: middle;
}
#customer .chat-section p::after{
  content: '';
  position: absolute;
  top: 10px;
  width: 0;
  height: 0;
  border:6px solid transparent;
}
#customer .chat-section .user p::after {
  right: -12px;
  border-left: 6px solid #20a0ff;
}
#customer .chat-section .custom-service p::after {
  left: -12px;
  border-right: 6px solid #20a0ff;
}
#customer .chat-section .end {
  width: 400px;
  margin: 0 auto;
  height: 40px;
  line-height: 40px;
  text-align: center;  
}
/*聊天信息动效*/
.msg-display-enter-active,
.msg-display-leave {
  position: relative;
  top: 0;  
  transition: all .2s cubic-bezier(.67,1.79,.65,.71);
}

.msg-display-enter,
.msg-display-leave-active {
  position: relative;
  top: 20px;
  transition: all .2s ease-in;
}
</style>

