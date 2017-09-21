<template>
  <div id="platform">
    <el-tabs v-model="activeName" type="card" @tab-click="changePlatform">
      <el-tab-pane v-for="cli in clients" :label="cli.name" :name="cli.name" :key="cli._id">
        <el-form ref="project"  label-width="120px">
          <el-form-item label="客户端封面:">
            <el-upload
              class="avatar-uploader"
              action="https://111"
              list-type="picture-card"
              :show-file-list="false"
              :auto-upload= "false"
              :on-change="beforeAvatarUpload"
              accept="image/jpeg"
              >
              <img v-if="client.cover" 
              :src="cover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="项目展示:">
            <el-upload
              action="https://11"
              list-type="picture-card"
              :auto-upload= "false"
              :multiple="true"
              :file-list="client.show"
              :on-change="saveFileList"
              :on-remove="saveDel"              
              :on-preview="handlePictureCardPreview"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="原型地址:">
            <el-input v-model="client.link.model"></el-input>
          </el-form-item>
          <el-form-item label="UI文件:">
            <el-upload
              class="upload"
              action="https://11"
              ref="upload"
              :on-change="saveUI"
              :on-remove="handleUIRemove"
              :auto-upload="false"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传zip文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item　label="技术清单:" v-if="power.has('sort/list')">
            <el-button @click="$router.push({path: '/repo/pepo_edit/list', query:{API_id: client.List}})">添加/编辑</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="dialogVisible" size="small">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div class="handle">
      <el-button @click="saveChange" v-if="power.has('project/client/edit')">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getClientDetials, editClient } from '../../api/projects.js'
export default {
  name: 'repo_platform',
  data () {
    return {
      activeName: 'android',
      clients: [],
      client: {
        cover: '',
        show: [],
        file: '',
        link: {
          model: '',
          ui: ''
        }
      },
      delShow: [],
      dialogImageUrl: '',
      dialogVisible: false,
      UIfile: ''
    }
  },
  mounted () {
    this.changePlatform()
  },
  computed: {
    cover () {
      const vm = this
      return vm.client.cover.indexOf('http') !== -1 ? vm.client.cover : `http://192.168.1.98:8808/${vm.client.cover}`
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  methods: {
    // 切换平台
    changePlatform () {
      const vm = this
      const id = vm.$route.query.platform
      console.log(vm.activeName)
      getClientDetials(id).then(res => {
        if (res.data.status === 200) {
          vm.clients = res.data.data.clients
          vm.clients.filter(client => {
            if (client.name === vm.activeName) {
              vm.client.show.splice(0, vm.client.show.length)
              client.show = client.show.map(pic => {
                const url = pic.indexOf('http') === -1 ? `http://192.168.1.98:8808/${pic}` : pic
                return {url}
              })
              setTimeout(() => {
                vm.client = client
              }, 0)
              return true
            }
          })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 保存封面
    beforeAvatarUpload (file) {
      const vm = this
      console.log(file)
      vm.client.file = file.raw
      vm.client.cover = URL.createObjectURL(file.raw)
    },
    // 保存照片墙
    saveFileList () {
      this.client.show = arguments[1]
    },
    // 保存删除文件
    saveDel (file, fileList) {
      const vm = this
      vm.client.show = fileList
      if (file.name) return
      vm.delShow.push(file.url)
    },
    // 保存UI组件
    saveUI (file, fileList) {
      const isZIP = 'application/zip'
      const vm = this
      fileList.length = 1
      if (isZIP) {
        fileList[0] = file
        vm.UIfile = file
      } else {
        vm.$message({
          type: 'warning',
          message: '上传文件格式错误'
        })
      }
    },
    // 移除文件
    handleUIRemove () {
      this.UIfile = ''
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    saveChange () {
      const vm = this
      const id = vm.client._id
      const Cover = vm.client.file
      const upPic = vm.client.show.filter(pic => {
        return pic.percentage === 0
      })
      const show = upPic.map(pic => {
        return pic.raw
      })
      const delShow = vm.delShow
      const ui = vm.UIfile.raw
      const modelUrl = vm.client.link.model
      editClient({id, Cover, show, ui, modelUrl, delShow}).then(res => {
        vm.$message({
          type: 'success',
          message: res.data.message
        })
      })
    }
  }
}
</script>

<style scoped>
#platform {
  width: 1200px;
  margin: 40px auto;
}
#platform .el-input {
  width: 200px;
}
#platform .upload {
  width: 300px;
}
#platform .avatar {
  width: 148px;
  height: 148px;
  display: block;
}
#platform .handle {
  text-align: center;
} 
</style>
