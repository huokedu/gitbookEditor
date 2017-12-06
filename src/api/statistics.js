import Axios from './index'
// 统计收入
function getIncomings ({year, month, page}) {
  return Axios.get('/income/statistics/query', {
    params: {
      page,
      year,
      month
    }
  })
}
// 统计IP
function getIPs ({allIp}) {
  return Axios.get('/ip/query', {
    params: {
      allIp
    }
  })
}
// ip详情
function getIPsDetails ({region, page, limit = 10, allIp}) {
  return Axios.get('/ip/details', {
    params: {
      region,
      page,
      limit,
      allIp
    }
  })
}
// 数据总览
function getGeneralData (params) {
  return Axios.get('/general/data/query')
}
export {
  getIncomings,
  getIPs,
  getIPsDetails,
  getGeneralData
}
