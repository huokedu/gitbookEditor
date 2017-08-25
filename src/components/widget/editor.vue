<template>
  <div id="mainBook"> 
    <mavon-editor style="height: 100%" v-model="value" @save="save" @imgAdd="saveImg" @imgDel="imgDel" :toolbars = "toolbars" /> 
  </div>
</template>

<script>
import { getContent, saveContent } from '../../js/axios.js'
import { Message } from 'element-ui'
export default {
  name: 'hello',
  data () {
    return {
      value: '',
      img_file: {},
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
      }
    }
  },
  mounted () {
  },
  methods: {
    // 获取文章详情
    getContent (id) {
      let vm = this
      getContent(id).then(res => {
        if (res.data.status === 200) {
          vm.value = res.data.data.article.content
          vm.$store.dispatch('article/getTags', res.data.data.article.tag)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    save (content) {
      const vm = this
      const title = document.querySelector('#mkTitle').textContent
      saveContent({ id: vm.id, content, pics: vm.img_file, title })
      .then((res) => {
        if (res.data.status === 200) {
          Message({
            type: 'success',
            message: '保存成功'
          })
        } else {
          Message({
            type: 'error',
            message: res.data.message
          })
        }
      })
      .catch((err) => {
        console.log(err)
        Message({
          type: 'error',
          message: '保存失败'
        })
      })
    },
    saveImg (name, $file) {
      const vm = this
      let tem = name
      const img = document.querySelector('img[rel="' + name + '"]')
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const w = canvas.width = image.width
        const h = canvas.height = image.height
        ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h)
        const data = canvas.toDataURL('image/jpeg', 0.5)
        // 去重
        Object.keys(vm.img_file).map((pos) => {
          if (vm.img_file[pos] === data) {
            const reg = new RegExp('(!\\[[\\w\\W]+?\\]\\()' + name + '(\\))', 'g')
            vm.value = vm.value.replace(reg, '$1' + pos + '$2')
            tem = pos
            return
          }
        })
        if (tem === name) {
          console.log(1)
          vm.img_file[name] = data
        }
      }
      image.src = img.src
    },
    imgDel (pos) {
      const vm = this
      delete this.img_file[pos]
      const reg = new RegExp('!\\[[\\w\\W]+?\\]\\(' + pos + '\\)', 'g')
      vm.value = vm.value.replace(reg, '')
    }
  },
  computed: {
    id () {
      return this.$store.state.article.article._id
    }
  },
  watch: {
    id (value) {
      this.getContent(value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 #mainBook {
   height: 800px;
   min-width: 920px;
   margin-left: 390px;
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
