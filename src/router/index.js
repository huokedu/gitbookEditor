import Vue from 'vue'
import Router from 'vue-router'

const homePage = () => import('../components/homePage.vue')

const Login = () => import('../components/login.vue')
const APIDocument = () => import('../components/repo-list/API_document.vue')
const repoList = () => import('../components/repo-list/repo_list.vue')
const repoAdd = () => import('../components/repo-list/repo_add.vue')
const repoPlatform = () => import('../components/repo-list/repo_platform.vue')
const techList = () => import('../components/repo-list/tech_list.vue')
const repoTag = () => import('../components/repo-list/repo_tag.vue')
const repoDoc = () => import('../components/tech-list/repo_document.vue')
const docList = () => import('../components/tech-list/doc_list.vue')

const orderList = () => import('../components/order/order_list.vue')
const orderDetails = () => import('../components/order/order_details.vue')

const commentList = () => import('../components/comment/comment_list.vue')

const memberList = () => import('../components/member/member_list.vue')
const memberAPI = () => import('../components/member/member_api.vue')
const memberProject = () => import('../components/member/member_project.vue')

const incomingStatistics = () => import('../components/statistics/incoming_statistics.vue')
const ipStatistics = () => import('../components/statistics/ip_statistics.vue')
const apiStatistics = () => import('../components/statistics/api_statistics.vue')
const ipDetails = () => import('../components/statistics/ip_details.vue')

const shadowMemberList = () => import('../components/shadow/shadow_member_list.vue')
const shadowCommentList = () => import('../components/shadow/shadow_comment_list.vue')
const shadowUserDetails = () => import('../components/shadow/shadow_user_details.vue')
const shadowProjectList = () => import('../components/shadow/shadow_project_list.vue')
const power = () => import('../components/power/power.vue')
const powerEdit = () => import('../components/power/power_edit.vue')

const customer = () => import('../components/customer/customer.vue')

const cdKey = () => import('../components/cdKey/cdKey_list.vue')

// 404页面
const notFound = () => import('../404.vue')
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [{
    path: '/home',
    name: '首页',
    component: homePage
  },
  {
    path: '/login',
    alias: '/',
    name: '登录',
    component: Login
  },
  {
    path: '/repo/API_document',
    name: 'API文档',
    component: APIDocument
  },
  {
    path: '/repo/repo_list',
    name: '项目列表',
    component: repoList
  },
  {
    path: '/repo/repo_add',
    name: '添加项目',
    component: repoAdd
  },
  {
    path: '/repo/repo_edit',
    name: '编辑项目',
    component: repoAdd
  },
  {
    name: '客户端',
    path: '/repo/repo_edit/repoPlatform',
    component: repoPlatform
  },
  {
    name: '技术清单',
    path: '/repo/pepo_edit/list',
    component: techList
  },
  {
    name: '标签',
    path: '/repo/tag',
    component: repoTag
  },
  {
    name: '添加文档',
    path: '/tech_list/add',
    component: repoDoc
  },
  {
    name: '编辑文档',
    path: '/tech_list/edit',
    component: repoDoc
  },
  {
    name: '文档列表',
    path: '/tech_list/list',
    component: docList
  },
  {
    name: '订单列表',
    path: '/order/order_list',
    component: orderList
  },
  {
    name: '订单详情',
    path: '/order/order_details',
    component: orderDetails
  },
  {
    name: '评论列表',
    path: '/comment/comment_list',
    component: commentList
  },
  {
    name: '会员列表',
    path: '/member/member_list',
    component: memberList
  },
  {
    name: '查看项目',
    path: '/member/member_api',
    component: memberAPI
  },
  {
    name: '查看接口',
    path: '/member/member_project',
    component: memberProject
  },
  {
    name: '收入统计',
    path: '/statistics/incoming_statistics',
    component: incomingStatistics
  },
  {
    name: 'IP统计',
    path: '/statistics/ip_statistics',
    component: ipStatistics
  },
  {
    name: '接口统计',
    path: '/statistics/api_statistics',
    component: apiStatistics
  },
  {
    name: '用户详情',
    path: '/statistics/ip_statistics/details',
    component: ipDetails
  },
  {
    name: '用户列表',
    path: '/shadow/member_list',
    component: shadowMemberList
  },
  {
    name: '影子评论列表',
    path: '/shadow/comment_list',
    component: shadowCommentList
  },
  {
    name: '影子用户详情',
    path: '/shadow/user/details',
    component: shadowUserDetails
  },
  {
    name: '影子项目列表',
    path: '/shadow/project_list',
    component: shadowProjectList
  },
  {
    name: '管理员',
    path: '/power',
    component: power
  },
  {
    name: '权限编辑',
    path: '/power/edit',
    component: powerEdit
  },
  {
    name: '客服',
    path: '/customer',
    component: customer
  },
  {
    name: '兑换码',
    path: '/cdKey',
    component: cdKey
  },
  {
    name: '404',
    path: '*',
    component: notFound
  }
  ]
})
