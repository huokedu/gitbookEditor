import Axios from './index'

// 获取项目列表
function getProjectList ({page, limit = 10}) {
  return Axios.post('/project/query', {
    page, limit
  })
}
// 添加新项目
function addProject ({ name, details, tag, serverUrl, cover }) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('details', details)
  formData.append('tag', JSON.stringify(tag))
  formData.append('serverUrl', serverUrl)
  formData.append('cover', cover)
  return Axios.post('/project/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export { getProjectList, addProject }
