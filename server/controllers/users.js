const bcrypt = require('bcrypt')
const User = require('../../models/User.js')

// Login User
exports.post = function (req, res) {
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
            const newUser = new User({
              username: username,
              hashedPassword: hash
            })

            newUser.save(handleRegisterUser)
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

  User.findOne({ username: username }, handleFindUser)
}
