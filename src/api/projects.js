import Axios from './index'

// 获取项目列表
function getProjectList ({page, limit = 10, status}) {
  return Axios.post('/project/query', {
    page, limit, status
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
// 添加新套餐
function addPart (data) {
  return Axios.post('project/part/add', data)
}
// 编辑套餐
function editPart (data) {
  return Axios.post('/project/part/edit', data)
}
// 获取项目详情
function getDetails (id) {
  return Axios.get('project/details', {
    params: {
      id
    }
  })
}
// 编辑项目
function editProject ({ id, name, details, tag, serverUrl, cover }) {
  const formData = new FormData()
  formData.append('id', id)
  formData.append('name', name)
  formData.append('details', details)
  formData.append('tag', JSON.stringify(tag))
  formData.append('serverUrl', serverUrl)
  formData.append('cover', cover)
  return Axios.post('/project/edit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export {
  getProjectList,
  addProject,
  addPart,
  editPart,
  getDetails,
  editProject
}
