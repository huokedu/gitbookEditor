import Axios from './index'

function getMemberList ({name, page}) {
  return Axios.get('/member/list', {
    params: {
      name,
      limit: 10,
      page
    }
  })
}
export {
  getMemberList
}
