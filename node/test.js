const User = require('../models/user')
const express = require('express')
const app = express()
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}
app.use(allowCrossDomain)
app.get('/api/articleList', (req, res) => {
  User.create({name: '张三', nickname: 'lala'}, function (err, doc) {
    if (err) return console.log(err)
    res.send(doc)
  })
})
var server = app.listen(3010, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
