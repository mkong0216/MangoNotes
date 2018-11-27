const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const users = require('./controllers/users.js')
const notepage = require('./controllers/notepage')
const notebook = require('./controllers/notebook')

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
app.get('/workspace/:userId', users.GetUsersWorkspace)

app.put('/workspace/add-notebook/:userId', users.UpdateUsersNotebooks)
app.put('/workspace/add-notepage/:userId', users.UpdateUsersNotepages)

// Handling notepages
app.post('/notepage/new', notepage.CreateNotepage)
app.get('/notepage/:notepageId/:userId', notepage.GetNotepage)
app.get('/notepages/recent/:userId', notepage.GetRecentNotepages)
app.put('/notepage/:notepageId/:userId', notepage.UpdateNotepage)

// Handling notebooks
app.post('/notebook/new', notebook.CreateNotebook)
app.get('/notebook/:notebookId/:userId', notebook.GetNotebook)
