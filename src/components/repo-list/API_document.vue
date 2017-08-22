<template>
  <div id="repoDocument">
    <doc-header title="穿云箭API文档" :pub="true" :preview="true"></doc-header>
    <drag-list></drag-list>
    <search label="API" @selected="getArticle"></search>
    <div>
      <mk-header :showTag="false" :title="title"></mk-header>
      <editor :id="id"></editor>    
    </div>
  </div>
</template>

<script>
import editor from '../widget/editor'
import docHeader from '../widget/document_header'
import dragList from '../widget/dragable_list'
import search from '../widget/document_search'
import mkHeader from '../widget/markdown_header'

import draggable from 'vuedraggable'

export default {
  name: 'repo_document',
  data () {
    return {
      id: ''
    }
  },
  methods: {
    getArticle (article) {
      let vm = this
      vm.id = article._id
      vm.title = article.title
    }
  },
  components: {
    editor,
    docHeader,
    dragList,
    search,
    mkHeader,
    draggable
  }
}
</script>

<style scoped>
 #repoDocument {

 }
</style>
