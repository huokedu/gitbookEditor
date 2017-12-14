import Axios from './index'

// 获取项目列表
function getProjectList ({page, limit = 10, status, name}) {
  return Axios.post('/project/query', {
    page, limit, status, name
  })
}
// 添加新项目
function addProject ({ name, details, tag, serverUrl, cover }) {
  const formData = new FormData()
  if (name) formData.append('name', name)
  if (details) formData.append('details', details)
  if (tag) formData.append('tag', JSON.stringify(tag))
  if (serverUrl) formData.append('serverUrl', serverUrl)
  if (cover) formData.append('cover', cover)
  return Axios.post('/project/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 添加新套餐
function addPart (data) {
  return Axios.post('/project/part/add', data)
}
// 编辑套餐
function editPart (data) {
  return Axios.post('/project/part/edit', data)
}
// 获取项目详情
function getDetails (id) {
  return Axios.get('/project/details', {
    params: {
      id
    }
  })
}
// 编辑项目
function editProject ({ id, name, details, tag, serverUrl, cover, status }) {
  const formData = new FormData()
  if (id) formData.append('id', id)
  if (name) formData.append('name', name)
  if (details) formData.append('details', details)
  if (tag) formData.append('tag', JSON.stringify(tag))
  if (serverUrl) formData.append('serverUrl', serverUrl)
  if (cover) formData.append('cover', cover)
  if (status) formData.append('status', status)
  return Axios.post('/project/edit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 获取项目客户端详情
function getClientDetials (id) {
  return Axios.get('/project/client/query', {
    params: {id}
  })
}
// 修改客户端信息
function editClient ({
  id, name, list, Cover, show, ui, modelUrl, delShow, vm
}) {
  const formData = new FormData()
  formData.append('id', id)
  if (list) formData.append('list', list)
  if (Cover) formData.append('Cover', Cover)
  if (show) {
    show.map(pic => {
      formData.append('show', pic)
    })
  }
  if (ui) formData.append('ui', ui)
  if (modelUrl) formData.append('modelUrl', modelUrl)
  if (delShow) formData.append('delShow', JSON.stringify(delShow))
  return Axios.post('/project/client/edit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: function (progressEvent) {
      // 对原生进度事件的处理
      vm.changeProgress(progressEvent)
    }
  })
}
// 添加标签分类
function addTags ({type, name}) {
  return Axios.post('/project/tag/add', {
    type,
    name
  })
}
// 删除标签
function delTags (id) {
  return Axios.post('/project/tag/del', {
    id
  })
}
// 获取订单列表
function getOrderList ({page, orderId, username, isTrial}) {
  return Axios.get('/order/query', {
    params: {
      page,
      orderId,
      username,
      isTrial,
      limit: 10
    }
  })
}
// 获取订单详情
function getOrderDetails ({id}) {
  return Axios.get('/order/details', {
    params: {
      id
    }
  })
}
export {
  getProjectList,
  addProject,
  addPart,
  editPart,
  getDetails,
  editProject,
  getClientDetials,
  editClient,
  addTags,
  delTags,
  getOrderList,
  getOrderDetails
}
