<template>
  <div id="mainBook"> 
    <mavon-editor ref="mavon" style="height: 100%" v-model="value" @save="save" @imgAdd="saveImg" @imgDel="imgDel" :editable="!isRecycle && power.has('article/edit')" :toolbars="isRecycle ? {} : toolbars" /> 
  </div>
</template>

<script>
import { getContent, saveContent, getReArticle } from '../../api/articles.js'
export default {
  name: 'hello',
  data () {
    return {
      value: '',
      imgFile: [],
      toolbars: {
        bold: true,
        italic: true,
        imagelink: true,
        code: true,
        table: true,
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        subfield: true, // 单双栏模式
        preview: true, // 预览
        strikethrough: true, // 中划线
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true,
        quote: true
      },
      watchMode: {
        editable: false
      },
      clearOut: ''
    }
  },
  mounted () {
    const vm = this
    if (vm.$route.query._id) return vm.getContent(vm.$route.query._id)
    vm.getContent(vm.id)
    vm.toolbars.save = vm.power.has('article/edit')
    // 监听刷新
    window.onbeforeunload = vm.reload
    // 失焦时取消自动保存
    document.querySelector('.auto-textarea-input').onblur = () => {
      clearTimeout(vm.clearOut)
    }
  },
  methods: {
    // 获取文章详情
    getContent (id) {
      let vm = this
      if (!vm.power.has('article/query')) return
      getContent(id).then(res => {
        if (res.data.status === 200) {
          vm.value = res.data.data.article.content
          vm.$store.dispatch('article/getTags', res.data.data.article.tags)
          if (vm.$route.query._id) vm.$store.dispatch('article/changeSelected', res.data.data.article)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    save (content) {
      const vm = this
      const title = document.querySelector('#mkTitle').textContent
      const tags = vm.tags.map(tag => {
        return tag._id
      })
      saveContent({ id: vm.id, content, pics: vm.imgFile, title, tags })
      .then((res) => {
        if (res.data.status === 200) {
          vm.imgFile = vm.imgFile.map((file, index) => {
            return index
          })
          res.data.imgList.map((img, index) => {
            if (!img) return
            vm.$refs.mavon.$img2Url('./' + index, img)
          })
          vm.$message({
            type: 'success',
            message: '文章保存成功'
          })
        } else {
          vm.$message({
            type: 'error',
            message: res.data.message
          })
        }
      })
      .catch((err) => {
        console.error(err)
        vm.$message({
          type: 'error',
          message: '保存失败'
        })
      })
    },
    saveImg (name) {
      const vm = this
      const img = document.querySelector('img[rel="' + name + '"]')
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const w = canvas.width = image.width
        const h = canvas.height = image.height
        ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h)
        canvas.toBlob((blob) => {
          vm.imgFile.push(blob)
        }, 'file', 0.5)
      }
      image.src = img.src
    },
    imgDel (pos) {
      const vm = this
      vm.imgFile[pos] = ''
      const reg = new RegExp('!\\[[\\w\\W]+?\\]\\(' + pos + '\\)', 'g')
      vm.value = vm.value.replace(reg, '')
    },
    reload () {
      alert('asdfasdf')
      return confirm('刷新、或者离开页面后，所有未保存的数据将会消失')
    }
  },
  computed: {
    id () {
      return this.$store.state.article.article._id
    },
    isRecycle () {
      return this.$store.state.article.isRecycle
    },
    tags () {
      return this.$store.state.article.tags
    },
    power () {
      return new Set(this.$store.state.power.powerList)
    }
  },
  watch: {
    id (id) {
      const vm = this
      if (!id) {
        vm.value = ''
        return
      }
      if (vm.isRecycle) {
        if (!vm.power.has('recycle/query')) {
          vm.value = ''
          return
        }
        getReArticle(id).then(res => {
          if (res.data.status === 200) {
            vm.value = res.data.data.doc.content
            vm.$store.dispatch('article/getTags', res.data.data.doc.tags)
          }
        }).catch((err) => {
          console.log(err)
        })
      } else {
        vm.getContent(id)
      }
    },
    value (content) {
      const vm = this
      clearTimeout(vm.clearOut)
      vm.clearOut = setTimeout(() => {
        vm.save(content)
      }, 10000)
    }
  },
  beforeDestroy () {
    window.onbeforeunload = ''
    this.$store.commit('article/CHANGE_SELECTED', {title: '', _id: '', stauts: true})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
 #mainBook {
   height: 800px;
   min-width: 920px;
   margin-left: 390px;
 }
 #mainBook .v-note-show li {
   list-style: inherit
 }
 #mainBook .v-note-read-content {
   width: 800px;
   margin: auto;
 }
 #mainBook .v-show-content , #mainBook .v-note-read-content{
    background-color: #fff;
    color: #515151;
}
 #mainBook .v-show-content h1, #mainBook .v-note-read-content h1{
    font-size: 22px;
    border: none;
}
 #mainBook .v-show-content h2, #mainBook .v-note-read-content h2 {
    font-size: 18px;
    border: none;
}
 #mainBook .v-show-content blockquote, #mainBook .v-note-read-content blockquote {
    border-color: #DD5A3E;
}
 #mainBook .v-show-content code, #mainBook .v-note-read-content code{
    opacity: 0.5;
    background: #F9AF98;
    border-radius: 2px;
    color: #515151;
    vertical-align: middle;
    font-size: 12px;
}
 #mainBook .v-show-content pre, #mainBook .v-note-read-content pre{
    border-radius: 2px;    
    background-color: rgba(66,66,66,.1);
}
#mainBook .v-show-content pre code, #mainBook .v-note-read-content pre code{
  background-color: #fff;
}
 #mainBook .v-show-content p + pre, #mainBook .v-note-read-content p + pre {
    background-color: rgba(215,83,42,0.05);
}
 #mainBook .v-show-content table, #mainBook .v-note-read-content table {
    display: table;
    text-align: center;
    font-size: 16px;
}
 #mainBook .v-show-content table th, #mainBook .v-note-read-content table th {
    color: #fff;
    background-color: #F9AF98;
    border-color: #fff;
}
.v-show-content blockquote, .v-show-content dl, .v-show-content ol, .v-show-content p, .v-show-content ul{
    font-size: 14px;
}
.v-note-read-content blockquote, .v-note-read-content dl, .v-note-read-content ol, .v-note-read-content p, .v-note-read-content ul{
    font-size: 14px;
}
</style>
