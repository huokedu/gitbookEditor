import Axios from './index'

// 获取文档列表
function getProjectList ({page, limit = 10}) {
  return Axios.post('/project/query', {
    page, limit
  })
}
export { getProjectList }
