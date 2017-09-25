import Axios from './index'
const getSession = (token) => {
  return Axios.get('/customer/session/query', {
    params: {
      token
    }
  })
}
export {
  getSession
}
