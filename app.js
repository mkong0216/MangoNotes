const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const users = require('./server/controllers/users.js')
const notepage = require('./server/controllers/notepage')
const notebook = require('./server/controllers/notebook')
const settings = require('./server/controllers/settings.js')

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
app.use(express.static(path.join(__dirname, 'build')))

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
app.put('/remove-item/:userId/:type/:noteId', users.RemoveNoteItem)

// Handling notepages
app.post('/notepage/new', notepage.CreateNotepage)
app.get('/notepage/:notepageId/:userId', notepage.GetNotepage)
app.get('/notepages/recent/:userId', notepage.GetRecentNotepages)
app.put('/notepage/:notepageId/:userId', notepage.UpdateNotepage)
app.put('/move-notepage/:notepageId/:userId', notepage.MoveNotepage)

// Handling notebooks
app.post('/notebook/new', notebook.CreateNotebook)
app.get('/notebook/:notebookId/:userId', notebook.GetNotebook)
app.put('/notebook/:notebookId/:userId', notebook.UpdateNotebook)
app.put('/move-notebook/:notebookId/:userId', notebook.MoveNotebook)

// Handling settings
app.put('/setting/:username', settings.UpdateUserSettings);
app.get('/setting/:username', settings.GetUserSettings);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});