const mongoose = require('mongoose')

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
  timestamp: {
    type: Date,
    required: true
  },
  content: [mongoose.Schema.Types.Mixed]
})

module.exports = mongoose.model('Notebook', NotebookSchema)
