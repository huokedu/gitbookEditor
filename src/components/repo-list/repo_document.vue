<template>
  <div id="repoDocument">
    <doc-header></doc-header>
    <listCol></listCol>
    <search></search>
    <div>
      <mk-header></mk-header>
      <editor></editor>    
    </div>
  </div>
</template>

<script>
import editor from '../widget/editor'
import docHeader from '../widget/document_header'
import listCol from '../widget/list-collection'
import search from '../widget/document_search'
import mkHeader from '../widget/markdown_header'
export default {
  name: 'repo_document',
  components: {
    editor,
    docHeader,
    listCol,
    search,
    mkHeader
  }
}
</script>

<style scoped>
 #repoDocument {

 }
</style>
