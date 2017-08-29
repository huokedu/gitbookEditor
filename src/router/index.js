import Vue from 'vue'
import Router from 'vue-router'
import repoDocument from '../components/repo-list/repo_document.vue'
import APIDocument from '../components/repo-list/API_document.vue'
import repoList from '../components/repo-list/repo_list.vue'
Vue.use(Router)
export default new Router({
  routes: [{
    path: '/repo/repo_document',
    name: 'repo_document',
    component: repoDocument
  },
  {
    path: '/repo/API_document',
    name: 'API_document',
    component: APIDocument
  },
  {
    path: '/repo/repo_list',
    name: '项目/项目列表',
    component: repoList
  }
  ]
})
