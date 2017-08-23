<template>
  <div id="header">
    <h2 contenteditable="true" ref="title">{{title}}</h2>
    <span v-if="pub" @click="$emit('pub', $refs.title.textContent, false)">
      <i class="el-icon-upload2"></i><br>
      发布
    </span>
    <span v-if="preview" @click="view">
      <i class="el-icon-view" ></i><br>
      预览
    </span>
    <span>
      <i class="el-icon-document" @click="$emit('pub', $refs.title.textContent, true)"></i><br>
      保存
    </span>
  </div>
</template>

<script>
import {Icon} from 'element-ui'
export default {
  name: 'document_header',
  props: {
    title: {
      type: String,
      required: true
    },
    preview: {
      type: Boolean,
      default: false
    },
    pub: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    view () {
      console.log('fasdf')
      window.open('http://192.168.1.98:8808/pub/599bd236fa367e6cf141118f')
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