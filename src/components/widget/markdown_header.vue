<template>
  <div id="mkHeader">
    <h2 contenteditable="true" ref="title">APIplus技术文档</h2>
    <i class="el-icon-edit" title="编辑" @click="titleFocus"></i>
    <el-button>
      添加标签
    </el-button>
    <div class="tag">
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        :closable="true"
        :type="tag.type"
      >
      {{tag.name}}
      </el-tag>
    </div>
  </div>
</template>

<script>
import {Icon, Button, Tag} from 'element-ui'
export default {
  name: 'markdown_header',
  data () {
    return {
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'gray' },
        { name: '标签三', type: 'primary' },
        { name: '标签四', type: 'success' },
        { name: '标签五', type: 'warning' },
        { name: '标签六', type: 'danger' },
         { name: '标签六', type: 'danger' },
          { name: '标签六', type: 'danger' }, { name: '标签六', type: 'danger' }
      ]
    }
  },
  components: {
    Icon,
    elButton: Button,
    elTag: Tag
  },
  methods: {
    titleFocus () {
      this.$refs.title.focus()
    }
  }
}
</script>

<style scoped>
  #mkHeader {
    padding: 1px;
    margin-left: 390px;
    min-width: 920px;
  }
  #mkHeader h2 {
    display: inline-block;
    margin: 30px 20px;
    font-size: 24px;
  }
  #mkHeader .tag {
    display: inline-flex;
    float: right;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    align-content: space-around;
    width: 59%;
    height: 87px;
    text-align: right;
    vertical-align: top;
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
  }
  #mkHeader .el-icon-edit:hover{
    color: #f63;
  }
</style>