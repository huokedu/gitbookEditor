<template>
  <section id="tagBox">
    <div class="type" v-for="name in tagTypes" :key="name">
      <p>{{name}}:</p>
      <div class="tag">
        <el-tag
          v-for="(tag, index) in tags[name]"
          :key="tag.id"
          :type="tag.type"
          @click.native="toggleTags(name,index,tag)"
        >
        {{tag.name}}
        </el-tag>
      </div>
    </div>
  </section>
</template>

<script>
import { getTags, saveContent } from '../../api/articles.js'
export default {
  name: 'tag_select_box',
  props: ['label'],
  data () {
    return {
      tags: {},
      tagTypes: []
    }
  },
  mounted () {
    const vm = this
    getTags()
    .then(res => {
      if (res.data.status === 200) {
        const set = new Set()
        res.data.data.map(types => {
          if (!Array.isArray(vm.tags[types.type])) {
            vm.tags[types.type] = []
          }
          set.add(types.type)
          const isChosen = vm.$store.state.article.tags.some(tag => {
            return tag._id === types._id
          })
          const type = isChosen ? 'primary' : 'grey'

          vm.tags[types.type].push({ name: types.name, id: types._id, type })
        })
        vm.tagTypes = [...set]
      }
    })
  },
  methods: {
    toggleTags (name, index, tag) {
      const vm = this
      tag.type = tag.type === 'primary' ? 'grey' : 'primary'
      vm.tags[name].splice(index, 1, tag)
      vm.tagTypes.splice(vm.tagTypes.length, 1)
      vm.$store.dispatch('article/getTags', {name: tag.name, _id: tag.id})
      if (vm.label === 'project') return
      vm.saveContent()
    },
    saveContent () {
      const vm = this
      const id = vm.$store.state.article.article._id
      const tags = vm.$store.state.article.tags
      saveContent({id, tags}).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style scoped>
  #tagBox {
    padding-bottom: 20px;
  }
  #tagBox .type p {
    margin: 6px 10px 10px;
    font-size: 26px;
  }
  #tagBox .tag>span {
    margin: 0 10px;
    cursor: pointer;
  }
</style>
