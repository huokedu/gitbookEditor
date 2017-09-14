import Axios from './index'
// 获取评论列表
function getComments ({page, state, project}) {
  return Axios.get('/project/comment/query', {
    params: {
      page,
      state,
      project,
      limit: 10
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
export {
  getComments,
  setComment
}