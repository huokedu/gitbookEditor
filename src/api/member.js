import Axios from './index'
// 获取评论列表
function getMemberList ({name, page}) {
  return Axios.get('/member/list', {
    params: {
      name,
      limit: 10,
      page
    }
  })
}
// 获取用户项目信息
function getUserProject (id) {
  return Axios.get('/member/project', {
    params: {
      id
    }
  })
}
// 修改密匙激活状态
function setKeyStatus ({userId, proId, status}) {
  return Axios.post('/member/set', {
    userId,
    proId,
    status
  })
}
// 获取各个路由调用情况
function getRouters ({id, page, router, proId, proName, start, end}) {
  return Axios.get('/member/router/query', {
    params: {
      id,
      proId,
      page,
      limit: 10,
      router,
      proName,
      start,
      end
    }
  })
}
export {
  getMemberList,
  getUserProject,
  setKeyStatus,
  getRouters
}
