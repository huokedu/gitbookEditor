import Io from 'socket.io-client'
let count = 1
let client = ''
export function setupConnection (token, vm) {
  const connect = () => {
    const link = 'http://192.168.1.99:8081?admin=' + token
    const screen = client = Io(link, {
      reconnectionAttempts: 5
    })
    screen.on('connect', () => {
      console.log(`连接成功：${screen.id}`)
    })
    screen.on('disconnect', () => {
      console.log('掉线')
    })
    screen.on('reconnect_attempt', (times) => {
      console.log('重连尝试')
    })
    screen.on('connect_timeout', () => {
      console.error('连接超时')
    })
    screen.on('connect_error', (err) => {
      console.log(`连接失败：${err.message}`)
    })
    screen.on('reconnect_failed', (err) => {
      console.error('重连失败')
      vm.$message({
        message: '无法链接客服服务器',
        type: 'error'
      })
    })
  }
  connect()  
}
export { client }