const mongoose = require('mongoose')
const NoteDetails = require('./NoteDetails')

let NotebookSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  parentNotebook: String,
  content: [ NoteDetails ]
}, { timestamps: true })

module.exports = mongoose.model('Notebook', NotebookSchema)
