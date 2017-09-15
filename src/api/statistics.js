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
function getIPs (params) {
  return Axios.get('/ip/query')
}
// ip详情
function getIPsDetails (region) {
  return Axios.get('/ip/details', {
    params: {
      region
    }
  })
}
export {
  getIncomings,
  getIPs,
  getIPsDetails
}
