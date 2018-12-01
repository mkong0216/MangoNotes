const mongoose = require('mongoose')

let TrashSchema = new mongoose.Schema({
    username: {type: String, required: true},
    starred: {type:[String], default:[]}
  })
  
module.exporst = {
    Trash: mongoose.model('Trash', TrashSchema)
}