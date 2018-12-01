const mongoose = require('mongoose')

let TrashSchema = new mongoose.Schema({
    username: {type: String, required: true},
    removed: {type:[String], default:[]}
  })


module.exports = mongoose.model('Trash', TrashSchema)