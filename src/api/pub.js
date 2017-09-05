import Axios from './index'
export default function (id) {
  return Axios.get(`pub/${id}`)
}
