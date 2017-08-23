import Axios from 'axios'

Axios.defaults.baseURL = 'http://192.168.1.98:8808'
Axios.defaults.withCredentials = true

// 获取文档列表
function getAPIDoc ({page, title, sort, order}) {
  return Axios.get('/article/list', {
    params: {
      label: 'API',
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
function saveContent ({ content, id, pics, title }) {
  return Axios.post('/article/edit', {
    content, id, pics, title
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
export {getAPIDoc, delDoc, addDoc, getContent, saveContent, getBook, pubBook}
