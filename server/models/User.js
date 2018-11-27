const mongoose = require('mongoose')
const NoteDetails = require('./NoteDetails')

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

let settingSchema = new mongoose.schema({
  username: {type: String, required = true},
  options: {type: String, required = true},
  modified: {type: Boolean, default: false}
})

let FavoriteSchema = new mongoose.schema({
  username: {type: String, required = true},
  starred: {type: [String], default:[]}
  
})

let TrashSchema = new mongoose.schema({
  username: {type: String, required = true},
  starred: {type:[String], default:[]}
})

module.exports = {
  Credentials: mongoose.model('Credentials', CredentialSchema, 'credentials'),
  User: mongoose.model('User', UserSchema, 'user'),
  Favorite: mongoose.model('Favorite', FavoriteSchema, 'favorite'),
  Trash: mongoose.model('Trash',TrashSchema, 'trash'),
  Setting: mongoose.model('Setting', settingSchema, 'setting')
}
