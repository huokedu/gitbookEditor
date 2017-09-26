import Axios from 'axios'

Axios.defaults.baseURL = 'http://192.168.1.99:8808'
Axios.defaults.withCredentials = true
Axios.defaults.headers = {'X-Token-Header': localStorage.token}
export default Axios
