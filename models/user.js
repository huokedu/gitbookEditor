/**
 * 用户表
 */

const mongoose = require('./index')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  name: String,
  nickname: {type: Schema.Types.String, index: true},
  token: String,
  phone: String,
  avatar: String,
  age: {type: Number, default: 18}
})

module.exports = mongoose.model('user', UserSchema)

