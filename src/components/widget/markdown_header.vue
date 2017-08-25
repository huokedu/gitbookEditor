<template>
  <div id="mkHeader">
    <div class="title">
      <h2 contenteditable="true" id="mkTitle" ref="title" @blur="changeTitle">{{$store.state.article.article.title}}</h2>
      <i class="el-icon-edit" title="编辑" @click="$refs.title.focus()"></i>
    </div>
    <div class="wrapper" v-if="showTag">
      <el-button @click="visible = true">
        添加标签
      </el-button>
      <div class="tag">
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
import {Icon, Button, Tag, Dialog} from 'element-ui'
import tags from '../widget/tag_select_box'
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
    }
  },
  computed: {
    tags () {
      return this.$store.state.article.tags
    }
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
    left:370px;
    display: inline-block;
    overflow: hidden;
  }
  #mkHeader h2 {
    display: inline-block;
    margin: 30px 20px;
    font-size: 24px;
    width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;    
  }
  #mkHeader .tag {
    display: inline-flex;
    float: right;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    align-content: space-around;
    height: 87px;
    width: 80%;
    text-align: right;
  }
  #mkHeader .tag .el-tag {
    margin: 0 10px;
  }
  #mkHeader button {
    float: right;
    margin: 32px 22px 0;
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