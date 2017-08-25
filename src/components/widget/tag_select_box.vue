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
import { Tag } from 'element-ui'
import { getTags } from '../../js/axios.js'
export default {
  name: 'tag_select_box',
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
        res.data.data.map(type => {
          if (!Array.isArray(vm.tags[type.type])) {
            vm.tags[type.type] = []
          }
          set.add(type.type)
          vm.tags[type.type].push({ name: type.name, id: type._id, type: 'grey' })
        })
        vm.tagTypes = [...set]
      }
    })
  },
  methods: {
    toggleTags (name, index, tag) {
      console.log(this.tags[name], tag, index)
      const vm = this
      tag.type = tag.type === 'primary' ? 'grey' : 'primary'
      vm.tags[name].splice(index, 1, tag)
      const tags = vm.tags
      vm.tags = {}
      vm.tags = tags
    }
  },
  components: {
    elTag: Tag
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
