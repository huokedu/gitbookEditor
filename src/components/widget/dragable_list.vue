<template>
  <div id="dragCol">
    <h2><i class="el-icon-plus"></i>&nbsp;&nbsp;新标题</h2>
    <draggable class="wrapper" element="div" v-model="collection" :options="dragOptions" > 
        <li class="col" v-for="(col, index) of collection" :key="col"> 
          <p class="level-one" :title="col">
            <span @click="lal(index)">{{col}}</span>
            <i class="el-icon-delete2" title="删除分类"></i>        
            <i class="el-icon-plus" title="添加文档"></i>      
          </p>
          <el-collapse-transition>
            <draggable element="div" v-model="collection1[collection[index]]" :options="dragOptions1" v-show="!show[index]"> 
              <transition-group type="transition" :name="'flip-list'">
                <li class="level-two" v-for="co of collection1[collection[index]]" :key="co">
                  <span :title="co">
                    {{co}}        
                  </span>
                  <i class="el-icon-delete2" title="删除分类"></i>        
                </li> 
              </transition-group>
            </draggable>
          </el-collapse-transition>
        </li> 
    </draggable>
  </div>
</template>

<script>
import {Icon} from 'element-ui'
import draggable from 'vuedraggable'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
export default {
  name: 'list-collection',
  data () {
    return {
      collection: ['fsdf', 'asdfadf', '你是大厦斯蒂芬'],
      collection1: {},
      editable: true,
      show: []
    }
  },
  mounted () {
    this.sec_dir()
  },
  methods: {
    lal (index) {
      if (event.target !== event.currentTarget) return
      this.show.splice(index, 1, !this.show[index])
    },
    sec_dir () {
      let vm = this
      let obj = {}
      for (let index in vm.collection) {
        obj[vm.collection[index]] = [index, index + 1, index + 2]
      }
      vm.collection1 = obj
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 0,
        group: 'levelOne',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    dragOptions1 () {
      return {
        animation: 0,
        group: 'levelTwo',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    }
  },
  components: {
    Icon,
    draggable,
    elCollapseTransition: CollapseTransition
  }
}
</script>

<style scoped>
#dragCol {
  float: left;
  width: 180px;
  height: 889px;
  color: #fff;
  background-color: rgba(255,102,51, .7);
  text-align: center;
  overflow: auto;
}
#dragCol h2{
  font-size: 24px;
  margin-left: -10px;
  cursor: pointer;
}
#dragCol .col {
  font-size: 20px;
  line-height: 45px;
  text-align: left;
  cursor: pointer;
}
#dragCol .level-one {
  margin: 0;
  padding: 0 5px 0 15px; 
}
#dragCol .level-one + div{
  overflow: hidden;
}
#dragCol .level-one>span, #dragCol .level-two>span{
  display: inline-block;
  text-indent: 0;
  width: 108px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  vertical-align: top;
}
#dragCol .level-two{
  padding-right: 5px;
}
#dragCol .level-two>span{
  text-indent: 35px;
  width: 145px;
}
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
#dragCol .level-two:hover, #dragCol .level-one:hover{
  color: #f63;
  background-color: #fff;
}
#docSearch .sortable-chose {
  width: 20px !important;
}
#dragCol .col .el-icon-delete2, #dragCol .col .el-icon-plus{
  float: right;
  margin: 14px 0 0 6px;
  color: rgba(255,147,111, 1);
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>