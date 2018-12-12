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
  creator: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  starred: Boolean,
  parentNotebook: String,
  removed: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = NoteDetails
