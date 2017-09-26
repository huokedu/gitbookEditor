import Io from 'socket.io-client'
let count = 1
let client = ''
export function setupConnection (token, vm) {
  const connect = () => {
    const link = 'http://192.168.1.99:8081?admin=' + token
    const screen = client = Io(link)
    screen.on('connect', () => {
      console.log(`连接成功：${screen.id}`)
      screen.on('message', (msg) => {
        if (!screen.connected) return;
      })
    screen.on('disconnect', () => {
      console.log('掉线')
      // 手动再次连接
      againConnect()
    })
  
    screen.on('reconnect_attempt', () => {
      console.log('重连')
      // 手动再次连接
      againConnect()
    })
  
    screen.on('connect_timeout', () => {
      console.error('连接超时')
      // 手动再次连接
      againConnect()
    })
  
    screen.on('connect_error', (err) => {
      console.error(`连接失败：${err.message}`)
      // 手动再次连接
      againConnect()
    })
  })
  function againConnect () {
    count ++ 
    if (count >5) {
      count = 1
      return
    }
    // 客户端重连时，可以更新验证参数
      connect(token)
    }
  }
  connect()  
}
export { client }