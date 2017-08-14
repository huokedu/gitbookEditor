<template>
  <div id="repoDocument">
    <doc-header></doc-header>
    <editor></editor>
  </div>
</template>

<script>
import editor from '../widget/editor'
import docHeader from '../widget/document_header'
export default {
  name: 'repo_document',
  components: {
    editor,
    docHeader
  }
}
</script>

<style scoped>
 #repoDocument {

 }
</style>
