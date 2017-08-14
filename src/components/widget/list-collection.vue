<template>
  <div id="listCol">
    <h2><i class="el-icon-plus"></i>&nbsp;&nbsp;新分类</h2>
    <div class="collection">
       <span class="col" v-for="col of collection" :key="col">
        <span :title="col">
          {{col}}        
        </span>
        <i class="el-icon-delete2" title="删除分类"></i>        
        <i class="el-icon-plus" title="添加文档"></i>
      </span>
    </div>
  </div>
</template>

<script>
import {Icon} from 'element-ui'
export default {
  name: 'list-collection',
  data () {
    return {
      collection: ['fasdf', 'asdfasdf', '你是大厦发斯蒂芬']
    }
  },
  components: {
    Icon
  }
}
</script>

<style scoped>
#listCol {
  float: left;
  width: 180px;
  height: 889px;
  color: #fff;
  background-color: rgba(255,102,51, .7);
  text-align: center;
}
#listCol h2{
  font-size: 24px;
  margin-left: -10px;
  cursor: pointer;
}
#listCol .col {
  display: block;
  padding: 0 12px;
  font-size: 20px;    
  line-height: 45px;
  text-align: left;
  cursor: pointer;
}
#listCol .col span{
  display: inline-block;
  width: 100px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;  
}
#listCol .col:hover{
  color: #f63;
  background-color: #fff;
}
#listCol .col .el-icon-delete2, #listCol .col .el-icon-plus{
  float: right;
  margin: 14px 0 0 6px;
  color: rgba(255,147,111, 1);
}
</style>