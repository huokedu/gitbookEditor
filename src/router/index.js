import Vue from 'vue'
import Router from 'vue-router'
import APIDocument from '../components/repo-list/API_document.vue'
import repoList from '../components/repo-list/repo_list.vue'
import repoAdd from '../components/repo-list/repo_add.vue'
import repoPlatform from '../components/repo-list/repo_platform.vue'
import techList from '../components/repo-list/tech_list.vue'
import repoTag from '../components/repo-list/repo_tag.vue'
import repoDoc from '../components/tech-list/repo_document.vue'
import docList from '../components/tech-list/doc_list.vue'

import orderList from '../components/order/order_list.vue'
Vue.use(Router)
export default new Router({
  routes: [{
    path: '/repo/API_document',
    name: '项目/API文档',
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
  },
  {
    name: '项目/编辑项目/客户端',
    path: '/repo/repo_edit/repoPlatform',
    component: repoPlatform
  },
  {
    name: '项目/编辑项目/客户端/技术清单',
    path: '/repo/pepo_edit/list',
    component: techList
  },
  {
    name: '项目/标签',
    path: '/repo/tag',
    component: repoTag
  },
  {
    name: '技术文档/添加文档',
    path: '/tech_list/add',
    component: repoDoc
  },
  {
    name: '技术文档/编辑文档',
    path: '/tech_list/edit',
    component: repoDoc
  },
  {
    name: '技术文档/文档列表',
    path: '/tech_list/list',
    component: docList
  },
  {
    name: '订单/订单列表',
    path: '/order/order_list',
    component: orderList
  }
  ]
})
