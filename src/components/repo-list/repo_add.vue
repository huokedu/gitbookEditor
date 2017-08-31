<template>
  <div id="repoAdd">
    <section>
      <div class="title">
        <h2>项目信息</h2> <div class="bar"></div>
      </div>
      <el-form ref="project" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="项目封面" prop="name">
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
          <el-button @click="visible = true">添加</el-button>        
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
    <section>
      <div class="title">
        <h2>项目套餐</h2> <div class="bar"></div>
      </div>
      <div class="part">
        <el-card class="box-card" v-for="(part, index) of parts" :key="part.name">
          <div slot="header" class="clearfix">
            <span class="head">{{part.name}}</span>
            <span>接口次数： {{part.count}}次</span><br>
            <span>销售价格： &yen; {{part.price}}</span>
          </div>
          <div class="handdle">
            <span>是否试用：</span>
            <el-switch
              v-model="part.trail"
              @change="checkTryStatus(index, part.trail)"
              on-text=""
              off-text="">
            </el-switch>
            <span>是否启用</span>
            <el-switch
              v-model="part.status"
              on-text=""
              off-text="">
            </el-switch>
            <el-button>
              编辑
            </el-button>
            <el-button>
              删除
            </el-button>
          </div>
        </el-card>
        <el-card class="box-card add" @click.native="visiblePart = true" >
          <i class="el-icon-plus"></i>
          <h3>添加套餐</h3>
        </el-card><br>
        <el-button @click="save('project')">保存</el-button>        
      </div>
      <el-dialog title="添加套餐" :visible.sync="visiblePart" size="tiny" style="min-width: 1200px">
        <parts v-if="visiblePart" @addPart="addPart"></parts>
      </el-dialog>
    </section>
  </div>
</template>

<script>
import tags from '../widget/tag_select_box'
import parts from '../widget/part_add'
import { addProject } from '../../api/projects.js'
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
        {
          name: '套餐A',
          count: '1000',
          price: '4324',
          status: 'online',
          trail: false
        },
        {
          name: '套餐B',
          count: '100',
          price: '424',
          status: 'offline',
          trail: true
        }
      ],
      isTry: false,
      isOnline: true
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
    checkTryStatus (index, val) {
      if (val) {
        this.parts.map((part, sort) => {
          if (sort === index) return
          part.trail = false
        })
      }
    },
    // 保存修改
    save (formName) {
      const vm = this
      vm.$refs[formName].validate((valid) => {
        if (!valid || !vm.form.cover || !vm.tags.length) return false
        vm.addProject()
      })
    },
    addPart (part) {
      const vm = this
      vm.visiblePart = false
      vm.parts.push(part)
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
            message: res.data.data.message
          })
        }
      })
    }
  },
  computed: {
    tags () {
      return this.$store.state.article.tags
    }
  },
  components: {
    tags,
    parts
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
