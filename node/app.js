// 导入http模块:
const http = require('http')
const process = require('child_process')
const fs = require('fs')
// const querystring = require('querystring')
// 创建http server，并传入回调函数:
process.exec('npm run start', function (error, stdout, stderr) {
  if (error !== null) {
    console.log('exec error: ' + error)
  }
  initbook(1)
})
var server = http.createServer(function (request, response) {
  // 回调函数接收request和response对象,
  // 获得HTTP请求的method和url:
  console.log(request.method)
  response.writeHead(200, {
    'Content-Type': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST'
  })
  // 获取post参数
  var chunks = []
  request.on('data', function (chunk) {
    chunks.push(chunk)
  })
  request.on('end', function (chunk) {
    let post = chunks.join('')
    let data = JSON.parse(JSON.stringify(post))
    data = data.slice(9, -2)
    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    process.exec('gitbook init', function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error)
      }
      initbook(data)
    })
    // 将HTTP响应的HTML内容写入response:
    response.end(JSON.stringify({'status': true}))
  })
})

// 让服务器监听4000端口:
server.listen(4001)

console.log('Server is running at http://127.0.0.1:4000/')
function initbook (data) {
  let dt = data
  fs.writeFile('./SUMMARY.md', dt, function (err) {
    process.exec('gitbook init', function (error, stdout, stderr) {
      if (err !== null) {
        console.log('exec error: ' + error)
      }
      console.log(stdout, stderr)
    })
  })
}
