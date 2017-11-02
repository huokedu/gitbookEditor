<template>
  <div id="platform">
    <el-tabs v-model="platform" 
    type="card" 
    @tab-click="changePlatform"
    v-loading.lock="fullscreenLoading"
    element-loading-text="文件上传中，请勿关闭、刷新页面"
    >
      <el-tab-pane v-for="client in clients" :label="client.name" :name="client.name" :key="client._id">
        <el-form ref="project"  label-width="120px"
        >
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
              :file-list="showPic"
              :on-change="saveFileList"
              :on-remove="saveDel"              
              :on-preview="handlePictureCardPreview"
              >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="原型地址:">
            <el-input :value = "client.link.model" @input="saveModel"></el-input>
          </el-form-item>
          <el-form-item label="UI文件:">
            <el-upload
              class="upload"
              action="https://11"
              ref="upload"
              :on-change="saveUI"
              :fileList = "fileList"
              :on-remove="handleUIRemove"
              :auto-upload="false"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传zip文件{{(uiMsg)}}</div>
            </el-upload>
          </el-form-item>
          <el-form-item　label="技术清单:" v-if="power.has('sort/list')">
            <el-button @click="turnToList(client.List)">添加/编辑</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="dialogVisible" size="small">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div class="handle">
      <el-button @click="saveChange"
      v-if="power.has('project/client/edit') && fullscreenLoading === false"
      >保存</el-button>
      <el-progress v-else :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
    </div>
  </div>
</template>

<script>
import { getClientDetials, editClient } from '../../api/projects.js'
import { deepClone } from '../../utils/index.js'
import { serverPath } from '../../../config/path.js'
import { mapState } from 'vuex'
export default {
  name: 'repo_platform',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      UIfile: '',
      fileList: [],
      uiMsg: '',
      percentage: 0,
      fullscreenLoading: false
    }
  },
  mounted () {
    const vm = this
    vm.getClients()
  },
  computed: {
    cover () {
      const vm = this
      const cover = vm.clients[vm.checkIndex].cover
      return cover && (cover.indexOf('http') !== -1 ? cover : `${serverPath}/${cover}`)
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    },
    ...mapState('project', [
      'clients', 'checkIndex', 'isSave', 'delShow', 'platform'
    ]),
    showPic () {
      const vm = this
      const show = vm.clients[vm.checkIndex].show.map(pic => {
        if (typeof pic === 'string') return pic
        return deepClone(pic)
      })
      return show
    }
  },
  methods: {
    getClients () {
      const vm = this
      if (vm.isSave) return
      const id = vm.$route.query.platform
      getClientDetials(id).then(res => {
        if (res.data.status === 200) {
          vm.$store.commit('project/GET_CLIENT', res.data.data.clients)
          // 初始化选中第一个
          const obj = {label: vm.clients[0].name}
          vm.changePlatform(obj)
        } else {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 切换平台
    changePlatform (pla) {
      const vm = this
      // 当前客户端
      vm.clients.some((client, index) => {
        if (client.name === pla.label) {
          vm.activeName = pla.label
          vm.uiMsg = client.link.ui.url && !client.link.ui.raw ? client.link.ui.url.slice(3) : ''
          vm.uiMsg = vm.uiMsg ? `(已上传${vm.uiMsg})` : ''
          vm.$store.commit('project/CHANGE_CLIENT', index)
          // 切换平台ui
          return true
        }
      })
    },
    // 保存封面
    beforeAvatarUpload (file) {
      const vm = this
      vm.$store.commit('project/CHANGE_COVER', file.raw)
    },
    // 保存照片墙
    saveFileList () {
      const vm = this
      vm.$store.commit('project/SAVE_SHOW', arguments[1])
    },
    // 保存删除文件
    saveDel (file, fileList) {
      const vm = this
      vm.$store.commit('project/SAVE_SHOW', fileList)
      if (file.name) return
      vm.$store.commit('project/DEL_SHOW', file.url)
    },
    // 保存UI组件
    saveUI (file, fileList) {
      const isZIP = 'application/zip'
      const vm = this
      if (isZIP === file.raw.type) {
        vm.$nextTick(() => {
          fileList[0] = fileList[1] ? fileList[1] : fileList[0]
          fileList.splice(1, 1)
        })
        vm.$store.commit('project/SAVE_UI', {vm, file})
      } else {
        fileList.length = 0
        vm.$message({
          type: 'warning',
          message: '上传文件格式错误'
        })
      }
    },
    // 移除文件
    handleUIRemove () {
      this.$store.commit('project/SAVE_UI', {vm: this, file: ''})
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    saveModel () {
      const vm = this
      vm.$store.commit('project/CHANGE_LINK', event.target.value)
    },
    saveChange () {
      const vm = this
      // 确定保存客户端
      let client = vm.clients[vm.checkIndex]
      const id = client._id
      const Cover = client.file
      const upPic = client.show.filter(pic => {
        return pic.percentage === 0
      })
      const show = upPic.map(pic => {
        return pic.raw
      })
      const delShow = client.delShow
      const ui = client.link.ui ? client.link.ui.raw : ''
      const modelUrl = client.link.model
      editClient({id, Cover, show, ui, modelUrl, delShow, vm}).then(res => {
        vm.$message({
          type: 'success',
          message: res.data.message
        })
      })
    },
    // 跳转到技术清单
    turnToList (id) {
      const vm = this
      // 跳转前保存信息
      vm.$router.push({path: '/repo/pepo_edit/list', query: { API_id: id }})
    },
    // 改变进度
    changeProgress (progressEvent) {
      const vm = this
      vm.percentage = (progressEvent.loaded / progressEvent.total * 100).toFixed(2) * 1
      vm.fullscreenLoading = vm.percentage !== 100
      vm.$store.commit('project/CHANGE_PROGRESS', {vm, percentage: vm.percentage})
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
