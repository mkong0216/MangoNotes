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
  timestamp: {
    type: Date,
    required: true
  },
  parentNotebook: {
    type: String,
    required: true
  }
})

// Login / Register credentials
let CredentialSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
})

// User's notebooks and notepages
let UserSchema = new mongoose.Schema({
  // id comes from User's credentials
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  // User's parent notebooks and free notepages 
  // Parent notebook: Notebook that is not within another notebook.
  // Free notepage: notepage that is not within a notebook.
  // Both notebooks and notepages are an array of objects in shape of { id, title, createdOn }
  notebooks: [ NoteDetails ],
  notepages: [ NoteDetails ]
})

module.exports = {
  Credentials: mongoose.model('Credentials', CredentialSchema),
  User: mongoose.model('User', UserSchema)
}
