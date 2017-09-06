<template>
 <div id="tagList">
  <el-row :gutter="20">
    <el-col :span="5">
      <div class="list">
        <h2>标签组</h2>
        <div class="sort">
          <span class="sort">fasdklfj</span>
          <span class="sort">fasdklfj</span>
          <span class="sort">fasdklfj</span>
          <span class="sort">fasdklfj</span>
        </div>
        <div class="handdle">
          <el-button icon="plus">添加标签组</el-button>      
        </div>
      </div>
    </el-col>
    <el-col :span="15">
      <div class="add">
        <div class="line">
          <span>标签组：</span><el-input v-model="tagType" placeholder="请输入内容"></el-input>
        </div>
        <div class="line">
          <span>标签:</span><el-input v-model="tagName" placeholder="请输入内容"></el-input>
        </div>
        <div class="tags">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            :closable="true"
            @close="handleClose(tag)"
            :type="tag.type"
          >
          {{tag.name}}
          </el-tag>
        </div>
        <div class="handdle">
          <el-button>保存</el-button>      
        </div>
      </div>
    </el-col>
  </el-row>
 </div>
</template>

<script>
export default {
  name: 'repo_tag',
  data () {
    return {
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'gray' },
        { name: '标签三', type: 'primary' },
        { name: '标签四', type: 'success' },
        { name: '标签五', type: 'warning' },
        { name: '标签六', type: 'danger' }
      ],
      tagType: '',
      tagName: ''
    }
  },
  methods: {
    handleClose () {
    }
  }
}

</script>

<style>
#tagList {
  margin: 50px auto;
  width: 1200px;
}
#tagList .list, #tagList .add {
  padding: 20px;  
  height: 600px;
  background-color: #eef1f6;
  border-radius: 5px;
}
#tagList h2 {
  margin: 0;
  padding-bottom: 30px;
  border-bottom: 2px solid rgba(204, 204, 204, 1);
}
#tagList .sort span {
  display: block;
  height: 45px;
  line-height: 45px;
  text-indent: 12px;
  border-bottom: 1px solid rgba(204, 204, 204, 1);
  cursor: pointer;
}
#tagList .sort span:hover {
  color: #20a0ff;
  border-color: #20a0ff;
}
#tagList .handdle {
  margin-top: 30px;
  text-align: center;
}
#tagList .line {
  height: 60px;
  line-height: 40px;
}
#tagList .line span{
  display: inline-block;
  padding: 10px;
  width: 100px;
}
#tagList .add .el-input{
  width: 200px;
}
#tagList .tags {
  padding: 25px;
  height: 360px;  
}
#tagList .tags .el-tag {
  margin: 20px;
}
</style>
