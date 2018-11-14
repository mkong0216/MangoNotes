const mongoose = require('mongoose')

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
  username: {
    type: String,
    required: true
  },
  // User's parent notebooks and free notepages 
  // Parent notebook: Notebook that is not within another notebook.
  // Free notepage: notepage that is not within a notebook.
  // Both notebooks and notepages are an array of objects in shape of { id, title, createdOn }
  notebooks: [mongoose.Schema.Types.Mixed],
  notepages: [mongoose.Schema.Types.Mixed]
})

module.exports = {
  Credentials: mongoose.model('Credentials', CredentialSchema),
  User: mongoose.model('User', UserSchema)
