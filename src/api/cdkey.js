import Axios from './index'

const getCdkeyList = ({page, key, status, name}) => {
  return Axios.get('/account/share/query', {
    params: {
      page,
      limit: 10,
      key,
      name,
      status
    }
  })
}

export {
  getCdkeyList
}
