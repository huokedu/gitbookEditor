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
function getShadowList ({page, user, limit = 10}) {
  return Axios.get('/shadow/user/query', {
    params: {
      page,
      user,
      limit
    }
  })
}
// 编辑影子用户
function editShadowUser ({id, name}) {
  return Axios.post('/shadow/user/edit', {
    id,
    name
  })
}
// 影子用户详情
function getShadowUserDetails ({id}) {
  return Axios.get('/shadow/user/details', {
    params: {
      id
    }
  })
}
// 影子用户购买项目
function shadowBuyProject ({project, users}) {
  return Axios.post('/shadow/project/buy', {
    project,
    users
  })
}
export {
  generateUser,
  delUser,
  addComment,
  getShadowList,
  editShadowUser,
  getShadowUserDetails,
  shadowBuyProject
}
