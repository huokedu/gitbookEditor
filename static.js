const express = require('express')

// 压缩中间件
const compression = require('compression')
const app = express()

const path = require('path')
// 启用G-zip
app.use(compression())
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

app.use(express.static(path.join(__dirname, 'dist')))

// 启动监听
app.listen(5000, function () {
  console.log(`apiplus后台接口监听在5000`)
})
