import Axios from './index'
// 生成用户
function generateUser (number) {
  return Axios.post('/shadow/generate/user', {number})
}
// 删除影子用户
function delUser (id) {
  return Axios.post('/shadow/user/del', {
    id
  })
}
// 添加影子评论
function addComment ({uid, projId, content, isBuy}) {
  return Axios.post('/shadow/generate/comment', {
    uid, projId, content, isBuy
  })
}
// 查询影子用户
function getShadowList () {
  return Axios.get('/shadow/user/query')
}
export {
  generateUser,
  delUser,
  addComment,
  getShadowList
}
