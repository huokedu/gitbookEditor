import Vue from 'vue'
import Router from 'vue-router'
import repoDocument from '../components/repo-list/repo_document.vue'

Vue.use(Router)
export default new Router({
  routes: [{
    path: '/repo_list/document',
    name: 'repo_document',
    component: repoDocument
  }]
})
