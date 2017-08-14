<template>
  <div id="header">
    <h2 contenteditable="true">APIplus技术文档</h2>
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
  components: {
    Icon
  }
}
</script>

<style scoped>
 #header {
  padding: 1px;
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
 #header span .el-icon-document{
   font-size: 20px;
 }
</style>