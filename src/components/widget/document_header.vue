<template>
  <div id="header">
    <h2 :contenteditable="editable" ref="title">{{title}}</h2>
    <span v-if="pub" @click="pubBook(false)">
      <i class="el-icon-upload2"></i><br>
      发布
    </span>
    <span v-if="preview" @click="view">
      <i class="el-icon-view" ></i><br>
      预览
    </span>
    <span @click="pubBook(true)">
      <i class="el-icon-document"></i><br>
      保存
    </span>
  </div>
</template>

<script>
import {Icon, Message} from 'element-ui'
import { pubBook } from '../../js/axios.js'

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
    pubBook (isSave) {
      const vm = this
      const title = vm.$refs.title.textContent
      const levelTwo = {}
      console.log(vm.$store.state.article.directory)
      const levelOne = vm.$store.state.article.directory.map((dir, index) => {
        levelTwo[dir.pri_dir] = []
        dir.sec_dir.map((seDir) => {
          levelTwo[dir.pri_dir].push(seDir._id)
        })
        return dir.pri_dir
      })
      pubBook({id: '599d52cf433770613ba10f3e', title, levelOne, levelTwo, isSave})
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
    }
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
</style>