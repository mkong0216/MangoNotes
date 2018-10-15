const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', UserSchema)