<template>
  <div id="header">
    <h2 :contenteditable="editable && !isRecycle" ref="title">{{title}}</h2>
    <i v-if="editable" class="el-icon-edit" title="编辑" @click="$refs.title.focus()"  v-show="!isRecycle"></i>
    <span v-if="pub && !isRecycle" @click="pubBook(false)">
      <i class="el-icon-upload2"></i><br>
      发布
    </span>
    <span v-if="preview && !isRecycle" @click="view">
      <i class="el-icon-view" ></i><br>
      预览
    </span>
    <span v-if="!isRecycle" @click="saveContent">
      <i class="el-icon-document"></i><br>
      保存
    </span>
  </div>
</template>

<script>
import {Icon, Message} from 'element-ui'
import { pubBook } from '../../js/axios.js'
import { mapState } from 'vuex'

export default {
  name: 'document_header',
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    pub: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    view () {
      console.log('fasdf')
      window.open('http://192.168.1.98:8808/pub/599bd236fa367e6cf141118f')
    },
    saveContent () {
      document.querySelector('.fa-floppy-o').click()
      this.pubBook(true)
    },
    pubBook (isSave) {
      const vm = this
      const title = vm.$refs.title.textContent
      pubBook({id: '59a378dea68bc013966da696', title, levelOne: vm.levelOne, levelTwo: vm.levelTwo, isSave})
      .then((res) => {
        Message({
          type: 'success',
          message: res.data.message
        })
      })
      .catch(err => {
        console.log(err)
        Message({
          type: 'error',
          message: '保存失败'
        })
      })
    }
  },
  computed: {
    title () {
      const vm = this
      if (vm.preview) return vm.$store.state.article.APITitle
      return 'APIplus技术文档'
    },
    ...mapState('article', [
      'levelOne', 'levelTwo', 'isRecycle'
    ])
  },
  components: {
    Icon
  }
}
</script>

<style scoped>
 #header {
  padding: 1px;
  border-bottom: 1px solid #f63;
 }
 #header h2 {
  display: inline-block;
  margin: 30px 20px;
  font-size: 24px;
 }
 #header span {
   float: right;
   margin: 22px 22px 0;
   line-height: 25px;
   font-size: 14px;
   text-align: center;
   cursor: pointer;
 }
 #header span:hover {
  color: #f63;
 }
 #header .el-icon-document, #header .el-icon-upload2, #header .el-icon-view{
   font-size: 20px;
   cursor: pointer;
 }
  #header .el-icon-edit{
    font-size: 20px;
    cursor: pointer;
  }
  #header .el-icon-edit:hover{
    color: #f63;
  }
</style>