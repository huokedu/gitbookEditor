<template>
  <div id="mkHeader">
    <div class="title">
      <h2 :contenteditable="!isRecycle" id="mkTitle" ref="title" @blur="changeTitle">{{title}}</h2>
      <i v-if="!isRecycle" class="el-icon-edit" title="编辑" @click="$refs.title.focus()"></i>
    </div>
    <div class="wrapper" >
      <el-button v-if="showTag && !isRecycle" @click="visible = true">
        添加标签
      </el-button>
      <el-button v-if="isRecycle" @click="recover">
        恢复文章
      </el-button>
      <el-button v-if="isRecycle" @click="delArticle">
        彻底删除
      </el-button>  
      <div class="tag" :style="{width: isRecycle ? '476px' : '550px'}" v-if="showTag">
        <el-tag
          v-for="(tag, index) in tags"
          :key="tag"
          type="primary"
        >
        {{tag}}
        </el-tag>
      </div>
      <el-dialog title="添加标签" :visible.sync="visible">
        <tags v-if="visible"></tags>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Icon, Button, Tag, Dialog, Message, MessageBox } from 'element-ui'
import tags from '../widget/tag_select_box'
import { recoverArticle, delArticle } from '../../js/axios.js'
import { mapState } from 'vuex'
export default {
  name: 'markdown_header',
  props: {
    showTag: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      visible: false
    }
  },
  components: {
    Icon,
    elButton: Button,
    elTag: Tag,
    elDialog: Dialog,
    tags
  },
  methods: {
    changeTitle () {
      const vm = this
      const title = document.querySelector('#mkTitle').textContent
      vm.$store.dispatch('article/changeTitle', title)
    },
    recover () {
      const vm = this
      const id = vm.$store.state.article.article._id
      recoverArticle(id).then(res => {
        if (res.data.status === 200) {
          Message({
            type: 'success',
            message: '恢复成功'
          })
        } else {
          Message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    delArticle () {
      const vm = this
      MessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = vm.$store.state.article.article._id
        delArticle(id).then(res => {
          if (res.data.status === 200) {
            Message({
              type: 'success',
              message: res.data.message
            })
          } else {
            Message({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  computed: {
    ...mapState('article', [
      'tags', 'isRecycle', 'title'
    ])
  }
}
</script>

<style scoped>
  #mkHeader {
    position: relative;    
    padding: 1px;
    margin-left: 390px;
    min-width: 920px;
  }
  #mkHeader .title{
    display: inline-block;
  }
  #mkHeader .wrapper {
    position: absolute;
    right:0;
    left:280px;
    display: inline-block;
    overflow: hidden;
  }
  #mkHeader h2 {
    display: inline-block;
    margin: 30px 20px;
    font-size: 24px;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;    
  }
  #mkHeader .tag {
    float: left;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    align-content: space-around;
    height: 87px;
    text-align: right;
  }
  #mkHeader .tag .el-tag {
    margin: 0 10px;
  }
  #mkHeader button {
    float: right;
    margin: 32px 11px 0;
    padding: 4px 6px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
  }
  #mkHeader button:hover {
    color: #fff;
    background-color:  #f63;
    border-color: #f63;
  }
  #mkHeader .el-icon-edit{
    font-size: 20px;
    cursor: pointer;
    vertical-align: middle;    
  }
  #mkHeader .el-icon-edit:hover{
    color: #f63;
  }
</style>