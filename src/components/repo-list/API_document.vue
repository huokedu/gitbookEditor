<template>
  <div id="repoDocument">
    <doc-header :pub="true" :preview="true" :editable="true"></doc-header>
    <drag-list></drag-list>
    <search label="API"></search>
    <div>
      <mk-header :showTag="false" ></mk-header>
      <editor></editor>    
    </div>
    
  </div>
</template>

<script>
import editor from '../widget/editor'
import docHeader from '../widget/document_header'
import dragList from '../widget/dragable_list'
import search from '../widget/document_search'
import mkHeader from '../widget/markdown_header'

export default {
  name: 'repo_document',
  components: {
    editor,
    docHeader,
    dragList,
    search,
    mkHeader
  }
}
</script>

<style scoped>

</style>
