import Vue from 'vue'
import Router from 'vue-router'
import repoDocument from '../components/repo-list/repo_document.vue'
import APIDocument from '../components/repo-list/API_document.vue'
import repoList from '../components/repo-list/repo_list.vue'
import repoAdd from '../components/repo-list/repo_add.vue'
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
  },
  {
    path: '/repo/repo_add',
    name: '项目/添加项目',
    component: repoAdd
  },
  {
    path: '/repo/repo_edit',
    name: '项目/编辑项目',
    component: repoAdd
  }
  ]
})
