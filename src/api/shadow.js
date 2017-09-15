import Axios from './index'
// 生成用户名
function generateName () {
  return Axios.post('/shadow/generate/name')
}
// 生成头像
function generateAvatar () {
  return Axios.post('/shadow/generate/avatar')
}
// 生成用户
function generateUser ({id, name, avatar}) {
  return Axios.post('/shadow/generate/user', {
    id,
    avatar,
    name
  })
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

export {
  generateName,
  generateAvatar,
  generateUser,
  delUser,
  addComment
}
