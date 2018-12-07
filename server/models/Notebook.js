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
  starred: { type: Boolean, default: false },
  content: [ NoteDetails ]
}, { timestamps: true })

NotebookSchema.methods.details = function () {
  const details = {
    title: this.title,
    id: this._id,
    type: 'notebook',
    creator: this.creator,
    updatedAt: this.updatedAt,
    starred: this.starred
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

NotebookSchema.methods.getParentNotebook = function (cb) {
  return this.model('Notebook').findOne({ title: this.parentNotebook, creator: this.creator }, '_id', cb)
}

NotebookSchema.methods.removeNoteDetails = function (noteId) {
  return this.model('Notebook').updateOne({ title: this.parentNotebook, creator: this.creator }, { $pull: { content: { id: noteId } }}, { multi: true })
}

module.exports = mongoose.model('Notebook', NotebookSchema)
