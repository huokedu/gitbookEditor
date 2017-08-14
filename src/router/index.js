import Vue from 'vue'
import Router from 'vue-router'
import repoDocument from '../components/repo-list/repo_document.vue'
import APIDocument from '../components/repo-list/API_document.vue'
Vue.use(Router)
export default new Router({
  routes: [{
    path: '/repo_list/repo_document',
    name: 'repo_document',
    component: repoDocument
  },
  {
    path: '/repo_list/API_document',
    name: 'API_document',
    component: APIDocument
  }
  ]
})
