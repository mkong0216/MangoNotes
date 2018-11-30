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

NotebookSchema.methods.details = function (cb) {
  const details = {
    title: this.title,
    id: this._id,
    type: 'notebook',
    creator: this.creator
  }

  return cb(details)
}

module.exports = mongoose.model('Notebook', NotebookSchema)
