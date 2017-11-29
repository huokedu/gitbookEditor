import Axios from './index'
// 获取评论列表
function getComments ({page, state, project, user, shadow}) {
  return Axios.get('/project/comment/query', {
    params: {
      page,
      state,
      project,
      user,
      limit: 10,
      shadow
    }
  })
}
// 审核评论
function setComment ({id, state, reply}) {
  return Axios.post('/project/comment/set', {
    id,
    state,
    reply
  })
}
// 添加评论
function addComment ({token, commentId, content}) {
  return Axios.post('/project/comment/add', {
    token,
    commentId,
    content
  })
}
export {
  getComments,
  setComment,
  addComment
}
