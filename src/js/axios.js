import Axios from 'axios'

Axios.defaults.baseURL = 'http://192.168.1.98:8808'
Axios.defaults.withCredentials = true

// 获取文档列表
function getAPIDoc ({label = 'API', page, title, sort, order}) {
  return Axios.get('/article/list', {
    params: {
      label,
      page,
      title,
      sort,
      order: order || { create_time: -1 },
      limit: 10
    }
  })
}
// 删除文档
function delDoc (id) {
  return Axios.post('/article/del', {
    id
  })
}
// 添加文档
function addDoc ({label, title, sort}) {
  return Axios.post('/article/add', {
    label,
    sort,
    title
  })
}
// 文档详情
function getContent (id) {
  if (!id) return Promise.resolve()
  return Axios.get('/article/query?id=' + id)
}
// 文档编辑接口
function saveContent ({ content, id, pics, title, tags }) {
  return Axios.post('/article/edit', {
    content, id, pics, title, tags
  })
}
// 获取文档
function getBook (id) {
  return Axios.get('/pub/query', {
    params: {
      id
    }
  })
}
// 生成文档目录
function pubBook ({id, title, levelOne, levelTwo, isSave}) {
  return Axios.post('/pub/release', {
    id, title, levelOne, levelTwo, isSave
  })
}
// 获取技术文章分类
function getSort () {
  return Axios.get('/sort/list')
}
// 添加分类
function addSort (name) {
  return Axios.post('/sort/add', {
    name
  })
}
// 删除分类
function delSort (id) {
  return Axios.post('/sort/del', {
    sort_id: id
  })
}
// 获取标签列表
function getTags () {
  return Axios.get('/project/tag/list')
}
export {
  getAPIDoc,
  delDoc,
  addDoc,
  getContent,
  saveContent,
  getBook,
  pubBook,
  getSort,
  addSort,
  delSort,
  getTags
}
