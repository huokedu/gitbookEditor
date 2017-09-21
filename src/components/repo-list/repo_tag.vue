<template>
 <div id="tagList">
  <el-row :gutter="20">
    <el-col :span="5">
      <div class="list">
        <h2>标签组</h2>
        <div class="sort">
          <span :class="[{selected: index === selectedIndex}, 'sort']" v-for="(Type, index) of tagTypes" :key="Type" @click="changeTag(index, Type)">{{Type}}</span>
        </div>
        <div class="handdle">
          <el-button icon="plus" @click="addTag" v-if="power.has('project/tag/add')">添加标签组</el-button>      
        </div>
      </div>
    </el-col>
    <el-col :span="15">
      <div class="add">
        <div class="tags">
          <el-tag
            v-for="(tag, index) in selectedTag"
            :key="tag.name"
            :closable="power.has('project/tag/del')"
            @close="handleClose(index)"
            type="primary"
          >
          {{tag.name}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else-if="changeShow && power.has('project/tag/add')" class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
        <div class="handdle">
          <el-button@click="saveTags()" v-if="power.has('project/tag/del') || power.has('project/tag/add')">保存</el-button>      
        </div>
      </div>
    </el-col>
  </el-row>
 </div>
</template>

<script>
import { getTags } from '../../api/articles.js'
import { addTags, delTags } from '../../api/projects.js'
export default {
  name: 'repo_tag',
  data () {
    return {
      tags: {},
      tagTypes: '',
      selectedTag: '',
      selectedIndex: 0,
      inputVisible: false,
      changeShow: true,
      inputValue: '',
      delTagsId: []
    }
  },
  mounted () {
    this.getTags()
  },
  methods: {
    getTags () {
      const vm = this
      getTags()
      .then(res => {
        if (res.data.status === 200) {
          const set = new Set()
          res.data.data.map(types => {
            if (!Array.isArray(vm.tags[types.type])) {
              vm.tags[types.type] = []
            }
            set.add(types.type)
            vm.tags[types.type].push({ name: types.name, id: types._id })
          })
          vm.tagTypes = [...set]
          vm.changeTag(0, res.data.data[0].type)
        }
      })
    },
    // 切换标签选择
    changeTag (index, type) {
      const vm = this
      vm.changeShow = false
      vm.selectedTag = vm.tags[type]
      vm.selectedIndex = index
      vm.$nextTick(_ => {
        vm.changeShow = true
      })
    },
    // 添加标签
    handleInputConfirm () {
      const vm = this
      let inputValue = vm.inputValue
      if (inputValue) {
        const duplicate = vm.selectedTag.some(tag => {
          return tag.name === vm.inputValue
        })
        if (duplicate) {
          return vm.$message({
            type: 'warning',
            message: '标签名重复'
          })
        }
        vm.selectedTag.push({name: inputValue})
      }
      vm.inputVisible = false
      vm.inputValue = ''
    },
    // 显示输入框
    showInput () {
      const vm = this
      vm.inputVisible = true
      vm.$nextTick(_ => {
        vm.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (index) {
      const vm = this
      vm.delTagsId.push(vm.selectedTag[index].id)
      vm.selectedTag.splice(index, 1)
    },
    // 添加
    addTag () {
      // 添加目录
      let vm = this
      vm.$msgbox.prompt('请输入标签分类名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\D/,
        inputErrorMessage: '标题名不能有数字'
      }).then(({ value }) => {
        // 标签名重复查询
        const dulpliate = vm.tagTypes.some(dir => {
          return dir === value
        })
        const message = dulpliate ? '标题重复' : '添加成功'
        const type = dulpliate ? 'warning' : 'success'
        vm.$message({
          type, message
        })
        if (dulpliate) return vm.addTag()
        const index = vm.tagTypes.length
        vm.tagTypes.splice(index, 0, value)
        vm.tags[value] = []
        vm.changeTag(index, value)
      }).catch((err) => {
        console.log(err)
        vm.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 添加或保存标签修改
    saveTags () {
      const vm = this
      let name = []
      vm.selectedTag.map((tag, index) => {
        if (tag.id) return
        name.push(tag.name)
      })
      // 判断是否做出修改
      name = name.join(',')
      console.log(name)
      if (name === '' && !vm.delTagsId.length) {
        vm.$message({
          type: 'warning',
          message: '您尚未做出修改'
        })
        return
      }
      if (name) vm.addTagType(name)
      if (vm.delTagsId.length) {
        vm.delTags(vm.delTagsId.join(','))
      }
    },
    // 添加新标签
    addTagType (name) {
      const vm = this
      addTags({name, type: vm.tagTypes[vm.selectedIndex]}).then(res => {
        if (res.data.status !== 200) {
          vm.$message({
            type: 'warning',
            message: res.data.message
          })
        } else {
          const type = res.data.data.type
          // 保存添加好的id
          const start = vm.tags[type[0].type].length - type.length
          type.map((type, index) => {
            console.log(type.name, vm.tags[type.type][start + index].name)
            if (type.name === vm.tags[type.type][start + index].name) vm.tags[type.type][start + index].id = type._id
          })
          vm.selectedTag = vm.tags[type[0].type]
          vm.$message({
            type: 'success',
            message: '修改成功'
          })
        }
      })
    },
    // 删除标签
    delTags (id) {
      const vm = this
      delTags(id).then(res => {
        if (res.data.status === 200) {
          vm.delTagsId = []
          vm.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          vm.$message({
            type: 'warning',
            message: '您尚未做出修改'
          })
        }
      })
    }
  },
  computed: {
    power () {
      return new Set(this.$store.state.power.powerList)
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
#tagList .sort span:hover, #tagList .selected {
  color: #20a0ff;
  border-color: #20a0ff;
}
#tagList .handdle {
  margin-top: 30px;
  text-align: center;
}
#tagList .tags {
  padding: 25px;
  height: 460px;  
}
#tagList .tags .el-tag {
  margin: 20px;
}
#tagList .tags .el-button, #tagList .tags .el-input {
  margin: 20px;
  width: 76px;
  height: 24px;
  padding-top: 0;
  padding-bottom: 0;
  vertical-align: top;
}
#tagList .tags .el-input {
  font-size: 12px;
}
</style>
