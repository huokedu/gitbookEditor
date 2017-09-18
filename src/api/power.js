import Axios from './index'
// 管理员登录
export default function accountLogin ({phone, password}) {
  return Axios.post('/account/login', {phone, password})
}
