<template>
  <div id="repoDocument">
    <doc-header title="APIplus技术文档"></doc-header>
    <listCol v-if="!isEdit"></listCol>
    <search v-if="!isEdit" label="List"></search>
    <div>
      <mk-header :class="{isEdit: isEdit}"></mk-header>
      <editor :class="{isEdit: isEdit}"></editor>    
    </div>
  </div>
</template>

<script>
import editor from '../widget/editor'
import docHeader from '../widget/document_header'
import listCol from '../widget/list_collection'
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
  },
  computed: {
    isEdit () {
      return this.$route.path === '/tech_list/edit'
    }
  }
}
</script>

<style scoped>
.isEdit {
  width: 99% ;
  margin: 0 !important;
}
</style>
