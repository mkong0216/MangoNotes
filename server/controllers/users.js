const bcrypt = require('bcrypt')
const { Credentials, User } = require('../models/User.js')

// Login / Register User
exports.AuthenticateUser = function (req, res) {
  const username = req.body.username
  const password = req.body.password
  const saltRounds = 10

  const authenticatePassword = async function (password, hash) {
    const match = await bcrypt.compare(password, hash)
    if (match) {
      res.sendStatus(200)
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
      const newUser = new User({ username: username })
      newUser.save(handleRegisterUser)
    }
  }

  const handleRegisterUser = function (err, newUser) {
    if (err) {
      console.log(err)
      res.status(500).send("Error creating new user in database.")
    } else {
      res.sendStatus(200)
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
<<<<<<< HEAD
            // Adding credentials to Credentials collection
            const newUserCredentials = new Credentials({
              username: username,
              hashedPassword: hash
            })

            newUserCredentials.save(handleSaveUserCredentials)
=======
            //user's credential is stored at the credential collection
            const newCredential = new Credential({
              username: username,
              hashedPassword: hash
            })
            //a new user container is created whenever a user register
            const newUserDoc = new UserDoc({
              username: username,
            })
            newCredential.save(handleRegisterUser);
            newUserDoc.save();
>>>>>>> 7b09eac1f8a2fd703ada17af4e73fa46781d0e86
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
        authenticatePassword(password, user.hashedPassword)
      }
    }
  }
  Credential.findOne({ username: username }, handleFindUser)
}


exports.getAllNotes = function(req, res){
  var username = req.query['username'];
  if(username != null){
    np.find({owner:username}, function(findError, result){
      if(findError){
        console.log(findError)
        //res.status(500).send("Unable to access to database")
      }
      else{
        /**loops through result and pushes the _id of note into an array then sends to frontend via res */
        var noteList = [];
        for(var i = 0; i < result.length; i++){
          id = result[i]['_id']
          noteList.push(id)
        }
        res.status(200).send(noteList)
      }
    })
  } 
}

<<<<<<< HEAD
  Credentials.findOne({ username: username }, handleFindUser)
}

// Getting user's parent notebooks and free notepages
exports.GetUsersWorkspace = function (req, res) {
  const username = req.params.username

  const handleFindUser = function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send("Error finding user in database.")
    } else {
      res.status(200).json(user)
    }
  }

  User.findOne({ username: username }, handleFindUser)
=======

exports.deleteUser = function(req, res){
  var username = req.query['username'];
  var confirm = req.query['confirm'];
  if(username && confirm == "true"){
    target = {username:username}
    Credential.findOneAndRemove(target, function(err){
      console.log(err);
    })
    UserDoc.findOneAndRemove(target, function(err){
      console.log(err)
    })
    UserInfo.findOneAndRemove(target, function(err){
      console.log(err)
    })
    res.send("User has been deleted from the system.")
  }
  else{
    res.send("Something went wrong.");
  }
>>>>>>> 7b09eac1f8a2fd703ada17af4e73fa46781d0e86
}

// Updating user's notebooks
exports.UpdateUsersNotebooks = function (req, res) {
  const username = req.params.username
  const notebook = req.body

  const handleUpdateNotebooks = function (err, notebook) {
    if (err) {
      console.log(err)
      res.status(500).send("Error updating user's notebooks")
    } else {
      console.log(notebook)
      res.status(200)
    }
  }

  User.findOneAndUpdate({ username: username }, { $push: { notebooks: notebook }}, handleUpdateNotebooks)
}

// Updating user's notepages
exports.UpdateUsersNotepages = function (req, res) {
  const username = req.params.username
  const notepage = req.body

  const handleUpdateNotepages = function (err, user) {
    if (err) {
      console.log(err)
      res.status(500).send("Error updating user's notepages")
    } else {
      res.status(200)
    }
  }

  User.findOneAndUpdate({ username: username }, { $push: { notepages: notepage }}, handleUpdateNotepages)
}