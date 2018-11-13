const mongoose = require('mongoose')

let NotepageSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  parentNotebook: String,
  content: String
})

module.exports = mongoose.model('Notepage', NotepageSchema)