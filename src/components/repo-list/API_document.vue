<template>
  <div id="repoDocument">
    <doc-header :title="docTitle" :pub="true" :preview="true" @pub="pubBook"></doc-header>
    <drag-list @selected="getArticle" @getDir="getDir"></drag-list>
    <search label="API" @selected="getArticle"></search>
    <div>
      <mk-header :showTag="false" :title="title"></mk-header>
      <editor :id="id" ></editor>    
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
import { pubBook } from '../../js/axios.js'

export default {
  name: 'repo_document',
  data () {
    return {
      id: '',
      title: '',
      docTitle: '穿云箭API文档',
      collection: []
    }
  },
  methods: {
    getArticle (article) {
      let vm = this
      vm.id = article._id
      vm.title = article.title
    },
    pubBook (title, isSave) {
      const vm = this
      const levelTwo = {}
      const levelOne = vm.collection.map((dir, index) => {
        levelTwo[dir.pri_dir] = []
        dir.sec_dir.map((seDir) => {
          levelTwo[dir.pri_dir].push(seDir._id)
        })
        return dir.pri_dir
      })
      pubBook({id: '599bd236fa367e6cf141118f', title, levelOne, levelTwo, isSave})
    },
    getDir (collection) {
      this.collection.push(...collection)
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

</style>
