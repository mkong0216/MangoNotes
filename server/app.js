const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const users = require('./resources/v1/users.js')

const app = express()
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/mangonotes"

/** connect to MongoDB datastore */
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

app.post('/login', users.post)
app.post('/register', users.post)