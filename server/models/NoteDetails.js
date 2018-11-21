const mongoose = require('mongoose')

let NoteDetails = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  parentNotebook: {
    type: String
  }
}, { timestamps: true })

module.exports = NoteDetails