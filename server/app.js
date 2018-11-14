const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const users = require('./controllers/users.js')
<<<<<<< HEAD
const notepage = require('./controllers/notepage')
=======
const notes = require('./controllers/notes')
>>>>>>> 7b09eac1f8a2fd703ada17af4e73fa46781d0e86

const app = express()
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/mangonotes"

/** persistent connection to mongoDB */
try {
    mongoose.connect(url, {
        useNewUrlParser: true
    }) 
} catch (error) {
    console.log(error)
}

const port = process.env.PORT || 5000

/** set up middlewares */
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});

// Handling users
app.post('/login', users.AuthenticateUser)
app.post('/register', users.AuthenticateUser)
app.get('/:username/workspace', users.GetUsersWorkspace)
app.put('/:username/workspace/add-notebook', users.UpdateUsersNotebooks)
app.put('/:username/workspace/add-notepage', users.UpdateUsersNotepages)

// Handling notepages
app.post('/:username/notepage/new', notepage.CreateNotepage)
