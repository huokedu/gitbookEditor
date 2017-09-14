import Axios from './index'

function getIncomings ({year, month, page}) {
  return Axios.get('/income/statistics/query', {
    params: {
      page,
      year,
      month
    }
  })
}
export {
  getIncomings
}
