const mongoose = require('mongoose')
const Notebook = require('./Notebook')

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
  starred: { type: Boolean, default: false },
  content: String,
  permissions: [String],
  removed: { type: Boolean, default: false }
}, { timestamps: true })

NotepageSchema.methods.details = function () {
  const details = {
    title: this.title,
    id: this._id,
    type: 'notepage',
    creator: this.creator,
    updatedAt: this.updatedAt,
    starred: this.starred,
    removed: this.removed,
    parentNotebook: this.parentNotebook
  }

  return details
}

NotepageSchema.methods.updateParentNotebook = function (data, cb) {
  if (data.created) {
    return Notebook.updateOne({ title: this.parentNotebook, creator: this.creator }, { $push: { content: data.details }}, cb)
  } else {
    return Notebook.updateOne({ title: this.parentNotebook, creator: this.creator, "content.id": this._id }, { $set: { "content.$": data.details }}, cb)
  }
}

module.exports = mongoose.model('Notepage', NotepageSchema)
