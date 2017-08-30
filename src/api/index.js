import Axios from 'axios'

Axios.defaults.baseURL = 'http://192.168.1.98:8808'
Axios.defaults.withCredentials = true

export default Axios
