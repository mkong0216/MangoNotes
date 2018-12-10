const bcrypt = require('bcrypt')
const Notepage = require('../models/Notepage.js')
const { Credentials, User } = require('../models/User.js')

// Login / Register User
exports.AuthenticateUser = function (req, res) {
  const username = req.body.username
  const password = req.body.password
  const saltRounds = 10

  const authenticatePassword = async function (password, userData) {
    const match = await bcrypt.compare(password, userData.hash)
    if (match) {
      res.status(200).json({
        userId: userData.userId,
        username: userData.username
      })
    } else {
      res.status(401).json({
        error: "Incorrect password."
      })
    }
  }

  const handleSaveUserCredentials = function (err, newCredentials) {
    if (err) {
      console.log(err)
      res.status(500).send("Error creating new user credentials in database")
    } else {
      const newUser = new User({ username: username, id: newCredentials._id })
      newUser.save(handleRegisterUser)
    }
  }

  const handleRegisterUser = function (err, newUser) {
    if (err) {
      console.log(err)
      res.status(500).send("Error creating new user in database.")
    } else {
      res.status(200).json({
        userId: newUser._id,
        username: newUser.username
      })
    }
  }

  const handleFindUser = function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send("Error finding user in database.")
    } 

    // Registering new user
    if (req.path === "/register") {
      if (!user) {
        bcrypt.hash(password, saltRounds, function (error, hash) {
          if (error) {
            console.log(error)
            res.status(500).send("Error hashing the password.")
          } else {
            // Adding credentials to Credentials collection
            const newUserCredentials = new Credentials({
              username: username,
              hashedPassword: hash
            })

            newUserCredentials.save(handleSaveUserCredentials)
          }
        })
      } else {
        res.status(401).json({
          error: "There already exists a user with that username."
        })
      }
    } else {
      // Signing in user
      if (!user) {
        res.status(401).json({
          error: "No user exists with the provided username."
        })
      } else {
        const userData = {
          username: username,
          userId: user._id,
          hash: user.hashedPassword
        }

        authenticatePassword(password, userData)
      }
    }
  }

  Credentials.findOne({ username: username }, handleFindUser)
}

// Getting user's parent notebooks and free notepages
exports.GetUsersWorkspace = function (req, res) {
  const userId = req.params.userId

  if (!userId) {
    res.status(401).send('Failed to provide a userId')
  }

  const handleFindUser = function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send("Error finding user in database.")
    } else if (!user) {
      res.status(500).send("No user exists with the provided id")
    } else {
      res.status(200).json({
        notebooks: user.notebooks,
        notepages: user.notepages,
        shared: user.shared
      })
    }
  }

  User.findOne({ id: userId }, handleFindUser)
}

// Updating user's notebooks
exports.UpdateUsersNotebooks = function (req, res) {
  const userId = req.params.userId
  const { createNew, ...notebook } = req.body

  if (!userId) {
    res.status(401).send("Failed to provide a userId")
  }

  const handleUpdateNotebooks = function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send("Error updating user's notebooks")
    } else if (!user) {
      res.status(500).send("No user exists with the provided id")
    } else {
      res.status(200).json({
        notebookId: notebook.id,
        updatedAt: notebook.updatedAt,
        starred: notebook.starred,
        title: notebook.title
      })
    }
  }

  if (createNew) {
    User.updateOne({ id: userId }, { $push: { notebooks: notebook }}, handleUpdateNotebooks)
  } else {
    User.updateOne({ id: userId, "notebooks.id":  notebook.id }, { $set: { "notebooks.$.title": notebook.title }}, handleUpdateNotebooks)
  }
}

// Updating user's notepages
exports.UpdateUsersNotepages = function (req, res) {
  const userId = req.params.userId
  const { createNew, ...notepage } = req.body

  if (!userId) {
    res.status(401).send("Failed to provide a userId")
  }

  const handleUpdateNotepages = function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send("Error updating user's notepages")
    } else if (!user) {
      res.status(500).send("No user exists with the provided id")
    } else {
      res.status(200).json({
        notepageId: notepage.id,
        updatedAt: notepage.updatedAt,
        title: notepage.title,
        starred: notepage.starred
      })
    }
  }

  if (createNew) {
    User.updateOne({ id: userId }, { $push: { notepages: notepage }}, handleUpdateNotepages)
  } else {
    User.updateOne({ id: userId, "notepages.id": notepage.id }, { $set: { "notepages.$": notepage }}, handleUpdateNotepages)
  }
}

exports.RemoveNoteItem = function (req, res) {
  const userId = req.params.userId
  const noteId = req.params.noteId
  const type = req.params.type

  if (!userId) {
    res.status(401).send("Failed to provide a userId")
  } else if (!noteId) {
    res.status(401).send("Failed to provide a notebook or notepage id")
  }

  const handleUpdateUser = function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send("Error updating user's workspace")
    } else {
      res.sendStatus(200)
    }
  }

  if (type === 'notebook') {
    User.updateOne({ id: userId }, { $pull: { notebooks: { id: noteId } }}, { multi: true }, handleUpdateUser)
  } else if (type === 'notepage') {
    User.updateOne({ id: userId }, { $pull: { notepages: { id: noteId } }}, { multi: true }, handleUpdateUser)
  }
}

exports.AddSharedNotepages = async function (req, res) {
  const userId = req.params.userId
  const noteId = req.params.noteId

  if (!userId) {
    res.status(400).send("Failed to provide user id")
  } else if (!noteId) {
    res.status(400).send("Failed to provide notepage id")
  }

  let user

  try {
    user = await User.findOne({ id: userId })
  } catch (error) {
    console.log(error)
    res.status(500).send("Error finding user in database")
  }

  if (!user) {
    res.status(500).send("Error finding user with provided id.")
  }

  let notepage

  try {
    notepage = await Notepage.findById(noteId)
  } catch (error) {
    console.log(error)
    res.status(500).send("Error finding notepage in database")
  }

  const handleSaveUser = function (error, user) {
    if (error) {
      console.log(error)
      res.status(500).send("Error saving user")
    } else {
      res.sendStatus(200)
    }
  }

  if (!notepage) {
    res.status(500).send("Error finding notepage with provided notepage id")
  } else if (user.id === notepage.creator) {
    res.sendStatus(200)
  } else {
    user.shared = [...user.shared, notepage.details()]
    user.save(handleSaveUser)
  }
}
