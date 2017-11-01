import Axios from 'axios'
import { serverPath } from '../../config/path'
Axios.defaults.baseURL = serverPath
Axios.defaults.withCredentials = true
Axios.defaults.headers = {'X-Token-Header': localStorage.token}
export default Axios
