const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test', {
  useMongoClient: true
}, function (err, db) {
  console.log(db)
  db.close()
  if (err) return process.exit(1)
  console.log('数据库链接成功')
})

module.exports = mongoose

