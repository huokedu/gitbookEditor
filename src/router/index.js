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
import orderDetails from '../components/order/order_details.vue'

import commentList from '../components/comment/comment_list.vue'

import memberList from '../components/member/member_list.vue'
import memberAPI from '../components/member/member_api.vue'
import memberProject from '../components/member/member_project.vue'

import incomingStatistics from '../components/statistics/incoming_statistics.vue'
import ipStatistics from '../components/statistics/ip_statistics.vue'
import apiStatistics from '../components/statistics/api_statistics.vue'
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
  },
  {
    name: '订单/订单详情/订单详情',
    path: '/order/order_details',
    component: orderDetails
  },
  {
    name: '评论/评论列表',
    path: '/comment/comment_list',
    component: commentList
  },
  {
    name: '会员/会员列表',
    path: '/member/member_list',
    component: memberList
  },
  {
    name: '会员/会员列表/查看项目',
    path: '/member/member_api',
    component: memberAPI
  },
  {
    name: '会员/会员列表/查看项目/查看接口',
    path: '/member/member_project',
    component: memberProject
  },
  {
    name: '统计/收入统计',
    path: '/statistics/incoming_statistics',
    component: incomingStatistics
  },
  {
    name: '统计/IP统计',
    path: '/statistics/ip_statistics',
    component: ipStatistics
  },
  {
    name: '统计/接口统计',
    path: '/statistics/api_statistics',
    component: apiStatistics
  }
  ]
})
