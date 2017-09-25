import Axios from './index'
// 管理员登录
function Login ({phone, password}) {
  return Axios.post('/account/login', {phone, password})
}
// 管理员列表
function getAdminList (params) {
  return Axios.get('/power/admin/list')
}
// 添加管理员
function addAdmin (id) {
  return Axios.post('/power/admin/add', {id})
}
// 删除管理员
function delAdmin (id) {
  return Axios.post('/power/admin/del', {id})
}
// 查询管理员权限
function queryPower (id) {
  return Axios.post('/power/admin/query', {id})
}
// 查询权限列表
function getPowerList () {
  return Axios.get('/power/list')
}
// 查询用户拥有权限
function getUserPower (id) {
  return Axios.post('/power/admin/query', {id})
}
// 编辑管理员权限
function editPower ({uid, ids}) {
  return Axios.post('/power/admin/edit', {
    uid,
    ids
  })
}
export {
  Login,
  getAdminList,
  addAdmin,
  delAdmin,
  queryPower,
  getPowerList,
  getUserPower,
  editPower
}
