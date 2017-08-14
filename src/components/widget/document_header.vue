<template>
  <div id="header">
    <h2>{{title}}</h2>
    <span v-if="pub">
      <i class="el-icon-upload2"></i><br>
      发布
    </span>
    <span v-if="preview">
      <i class="el-icon-view"></i><br>
      预览
    </span>
    <span>
      <i class="el-icon-document"></i><br>
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