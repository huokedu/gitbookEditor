<template>
  <div id="repoAdd">
    <section>
      <div class="title">
        <h2>项目信息</h2> <div class="bar"></div>
      </div>
      <el-form ref="project" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="项目封面">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :show-file-list="false"
            :auto-upload= "false"
            :on-change="beforeAvatarUpload"
            accept="image/jpeg"
            >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="服务器地址" prop="serverUrl">
          <el-input v-model="form.serverUrl"></el-input>
        </el-form-item>
        <el-form-item label="项目标签" style="width:920px">
          <section class="tags">
            <el-tag
              v-for="tag in tags"
              :key="tag._id"
              :closable="true"
              @close="toggleTags(tag)"
              type="primary"
            >
            {{tag.name}}
            </el-tag>
          </section>
          <el-button @click="visible = true"  v-if="power.has('project/tag/list')">添加</el-button>        
        </el-form-item>
        <el-form-item label="项目描述" prop="details" >
          <el-input 
            type="textarea" :rows="6" resize="none" 
            placeholder="请输入" v-model="form.details"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-dialog title="添加标签" :visible.sync="visible">
        <tags v-if="visible" label="project"></tags>
      </el-dialog>
    </section>
    <section v-if="$route.path === '/repo/repo_edit'">
      <div class="title">
        <h2>项目套餐</h2> <div class="bar"></div>
      </div>
      <div class="part">
        <transition-group name="el-zoom-in-center">
          <el-card class="box-card" v-for="(part, index) of parts" :key="part.name">
            <div slot="header" class="clearfix">
              <span class="head">{{part.name}}</span>
              <span>接口次数： {{part.count}}次</span><br>
              <span>销售价格： &yen; {{part.price}}</span>
            </div>
            <div class="handdle" v-if="power.has('project/part/edit')">
              <span>是否试用：</span>
              <el-switch
                v-model="part.trial"
                @change="checkTryStatus(index, part.trial)"
                on-text=""
                off-text="">
              </el-switch>
              <span>是否启用</span>
              <el-switch
                v-model="part.status"
                @change="checkOnline(index, part.status)"
                on-text=""
                off-text="">
              </el-switch>
              <el-button @click="changePart(index)" >
                编辑
              </el-button>
              <el-button　@click="delPart(index)">
                删除
              </el-button>
            </div>
          </el-card>
        </transition-group>
        <el-card class="box-card add" @click.native="changePart(-1)" v-if="power.has('project/part/add')">
          <i class="el-icon-plus"></i>
          <h3>添加套餐</h3>
        </el-card><br>
      </div>
      <el-dialog title="添加套餐" :visible.sync="visiblePart" size="tiny" style="min-width: 1200px">
        <parts v-if="visiblePart" @addPart="editPart" :part="choosePart" :ProId="$route.query.id" :partId="partId" :parts="parts"></parts>
      </el-dialog>
    </section>
    <section class="part">
      <el-button @click="save('project')" v-if="power.has('project/edit')">保存</el-button>
    </section>
  </div>
</template>

<script>
import tags from '../widget/tag_select_box'
import parts from '../widget/part_add'
import { staticPath } from '../../../config/path.js'
import { addProject, getDetails, editProject, editPart } from '../../api/projects.js'
export default {
  name: 'repo_add',
  data () {
    return {
      visible: false,
      visiblePart: false,
      imageUrl: '',
      form: {
        name: '',
        serverUrl: '',
        details: '',
        cover: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        serverUrl: [
          { required: true, message: '请输入服务器地址', trigger: 'blur' }
        ],
        details: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
          { min: 20, message: '20个字符以上', trigger: 'blur' }
        ]
      },
      parts: [
      ],
      delId: [],
      partId: '',
      choosePart: {}
    }
  },
  mounted () {
    const vm = this
    if (vm.$route.path === '/repo/repo_edit' && vm.$route.query.id) {
      getDetails(vm.$route.query.id)
      .then(res => {
        if (res.data.status === 200) {
          const dt = res.data.data.project
          vm.form.name = dt.name
          vm.form.serverUrl = dt.server.host
          vm.imageUrl = dt.cover.indexOf('http') === -1 ? `${staticPath}/${dt.cover}` : dt.cover
          vm.form.details = dt.details
          // 获取标签
          vm.$store.dispatch('article/getTags', dt.tag)
          // 填充套餐
          vm.parts = dt.part
        }
      })
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      this.form.cover = file.raw
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    toggleTags (tag) {
      this.$store.dispatch('article/getTags', {name: tag.name, _id: tag._id})
    },
    // 确保只有一个试用套餐
    checkTryStatus (index, val) {
      const vm = this
      editPart({id: vm.parts[index]._id, trial: val}).then(res => {
        if (res.data.status === 200) {
          vm.parts.map((part, sort) => {
            if (sort === index) return
            if (vm.parts.length >= 4 && part.trial) {
              part.status = false
            }
            part.trial = false
          })
          const message = val ? '套餐已设置为试用套餐' : '套餐已取消试用'
          vm.$message({
            type: 'success',
            message
          })
        }
      })
    },
    // 确保最多只有三个套餐上线
    checkOnline (index, val) {
      let count = 0
      const vm = this
      vm.parts.map((part, sort) => {
        if (part.trial) return
        count = part.status ? ++count : count
      })
      if (count === 4) {
        vm.parts[index].status = false
        return vm.$message({
          type: 'warning',
          message: '最多上线三个正式套餐'
        })
      }
      editPart({id: vm.parts[index]._id, status: val}).then(res => {
        if (res.data.status === 200) {
          const message = val ? '套餐已上线' : '套餐已下线'
          vm.$message({
            type: 'success',
            message
          })
        }
      })
    },
    // 保存修改
    save (formName) {
      const vm = this
      vm.$refs[formName].validate((valid) => {
        if (!valid) return false
        if (!vm.tags.length) {
          vm.$message({
            type: 'warning',
            message: '请选择至少一个标签'
          })
          return false
        }
        // 判断处于什么路由
        if (vm.$route.path === '/repo/repo_edit' && vm.$route.query.id) {
          vm.editProject(vm.$route.query.id)
        } else {
          if (!vm.form.cover) {
            vm.$message({
              type: 'warning',
              message: '请选择项目封面'
            })
            return false
          }
          vm.addProject()
        }
      })
    },
    // 同步套餐编辑状态
    editPart (part) {
      const vm = this
      vm.visiblePart = false
      if (part.index || part.index === 0) {
        const index = part.index
        delete part.index
        return vm.parts.splice(index, 1, part)
      }
      vm.parts.push(part)
    },
    // 传递参数给套餐编辑窗口
    changePart (index) {
      const vm = this
      if (index === -1) {
        vm.choosePart = ''
      } else {
        // 复制对象，防止双向绑定
        const {count, name, price, status, trial} = vm.parts[index]
        vm.choosePart = {count, name, price, status, trial, index}
        vm.partId = vm.parts[index]._id
      }
      vm.visiblePart = true
    },
    // 添加项目
    addProject () {
      const vm = this
      vm.form.tag = vm.tags.map(tag => {
        return tag._id
      })
      addProject(vm.form).then(res => {
        if (res.data.status === 200) {
          vm.$router.push('/repo/repo_list')
        } else {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 删除套餐
    delPart (index) {
      const vm = this
      const delId = vm.parts[index]._id
      editPart({delId}).then(res => {
        if (res.data.status === 200) {
          vm.parts.splice(index, 1)
          vm.$message({
            type: 'success',
            message: '删除套餐成功'
          })
        } else {
          vm.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    // 编辑项目
    editProject (id) {
      const vm = this
      vm.form.tag = vm.tags.map(tag => {
        return tag._id
      })
      vm.form.id = id
      editProject(vm.form).then(res => {
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: res.data.message
          })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    }
  },
  computed: {
    tags () {
      return this.$store.state.article.tags
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  components: {
    tags,
    parts
  },
  beforeDestroy () {
    this.$store.dispatch('article/getTags', [])
  }
}
</script>

<style>
  #repoAdd {
    margin: 50px auto;
    width: 1200px;
  }
  #repoAdd .el-input {
    width: 200px;
  }
  #repoAdd .el-textarea {
    width: 800px;
  }
  #repoAdd .el-tag {
    margin: 0 20px;
  }
  #repoAdd .el-form-item__content .tags {
    display: inline-block;    
    width: 700px;
    vertical-align: top;    
  }
  #repoAdd .title {
    margin: 30px 0;
  }
  #repoAdd .title h2 {
    display: inline;
    vertical-align: middle;    
  }
  #repoAdd .title .bar {
     display: inline-block;
     margin-left: 20px;
     width: 1000px;
     height: 1px;
     background-color: #adadad;
     vertical-align: middle;
  }
  #repoAdd .part {
    text-align: center;
  }
  #repoAdd .box-card {
    display: inline-block;
    margin: 30px;
    width: 300px;
    height: 263px;
  }
  #repoAdd .add {
    cursor: pointer;
  }
  #repoAdd .clearfix {
    text-align: left;
    line-height: 36px;    
  }
  #repoAdd .clearfix .head {
    font-size: 20px;
    font-weight: bold;
    display: block;
    text-align: center;
  }
  #repoAdd .box-card .handdle {
    overflow: hidden;
  }
  #repoAdd .box-card .handdle>span {
    vertical-align: middle;
  }
  #repoAdd .box-card .el-icon-plus{
    width: 260px;
    height: 120px;
    line-height: 150px;
    font-size: 40px;
    text-align: center;
  }
  #repoAdd .box-card h3 {
    text-align: center;
  }
  #repoAdd .box-card .el-button {
    float: right;
    margin: 20px 10px 0;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>
