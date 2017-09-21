<template>
  <div id="header">
    <h2 :contenteditable="editable && !isRecycle" ref="title">{{title}}</h2>
    <i v-if="editable" class="el-icon-edit" title="编辑" @click="$refs.title.focus()"  v-show="!isRecycle"></i>
    <span v-if="pub && !isRecycle && power.has('pub/release')" @click="pubBook(false)" 
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命发布中,等等我。。。。。"
    >
      <i class="el-icon-upload2"></i><br>
      发布
    </span>
    <span v-if="preview && !isRecycle && power.has('pub/release')" @click="view">
      <i class="el-icon-view" ></i><br>
      预览
    </span>
    <span v-if="!isRecycle && power.has('article/edit')" @click="saveContent">
      <i class="el-icon-document"></i><br>
      保存
    </span>
  </div>
</template>

<script>
import { pubBook } from '../../api/articles.js'
import checkPub from '../../api/pub.js'
import { mapState } from 'vuex'

export default {
  name: 'document_header',
  data () {
    return {
      fullscreenLoading: false
    }
  },
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    pub: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    view () {
      const vm = this
      checkPub(vm.id).then(res => {
        if (res.status === 200) {
          window.open(`http://192.168.1.98:8808/pub/${vm.id}`)
        } else {
          vm.$message({
            type: 'warning',
            message: '文档尚未发布，请先发布文档'
          })
        }
      })
      .catch(e => {
        console.log(e)
        vm.$message({
          type: 'warning',
          message: '文档尚未发布，请先发布文档'
        })
      })
    },
    saveContent () {
      if (document.querySelector('.fa-floppy-o')) document.querySelector('.fa-floppy-o').click()
      if (this.$route.path === '/tech_list/add' || !this.power.has('pub/release')) return
      this.pubBook(true)
    },
    pubBook (isSave) {
      const vm = this
      const title = vm.$refs.title.textContent
      vm.fullscreenLoading = !isSave
      pubBook({id: vm.id, title, levelOne: vm.levelOne, levelTwo: vm.levelTwo, isSave, token: vm.$store.state.power.token})
      .then((res) => {
        vm.fullscreenLoading = false
        if (res.data.status === 200) {
          vm.$message({
            type: 'success',
            message: res.data.message
          })
          return
        }
        setTimeout(() => {
          vm.$message({
            type: 'warning',
            message: res.data.message
          })
        }, 1000)
      })
      .catch(err => {
        console.log(err)
        vm.$message({
          type: 'error',
          message: '保存失败'
        })
      })
    }
  },
  computed: {
    title () {
      const vm = this
      if (vm.preview) return vm.$store.state.article.APITitle
      return 'APIplus技术文档'
    },
    ...mapState('article', [
      'levelOne', 'levelTwo', 'isRecycle'
    ]),
    id () {
      return this.$route.query.API_id
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  }
}
</script>

<style scoped>
 #header {
  padding: 1px;
  border-bottom: 1px solid #f63;
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
 #header .el-icon-document, #header .el-icon-upload2, #header .el-icon-view{
   font-size: 20px;
   cursor: pointer;
 }
  #header .el-icon-edit{
    font-size: 20px;
    cursor: pointer;
  }
  #header .el-icon-edit:hover{
    color: #f63;
  }
</style>