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

NotebookSchema.methods.details = function () {
  const details = {
    title: this.title,
    id: this._id,
    type: 'notebook',
    creator: this.creator,
    updatedAt: this.updatedAt
  }

  return details
}

NotebookSchema.methods.updateParentNotebook = function (data, cb) {
  if (data.created) {
    return this.model('Notebook').updateOne({ title: this.parentNotebook, creator: this.creator }, { $push: { content: data.details }}, cb)
  } else {
    return this.model('Notebook').updateOne({ title: this.parentNotebook, creator: this.creator, "content.id": this._id }, { $set: { "content.$": data.details }}, cb)
  }
}

module.exports = mongoose.model('Notebook', NotebookSchema)
