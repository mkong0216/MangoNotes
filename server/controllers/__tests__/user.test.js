import request from 'supertest'
import express from 'express'
import users from '../users'

function setupMockServer () {
    const app = express()
    app.use(express.json())

    app.post('/login', users.AuthenticateUser)
    app.post('/register', users.AuthenticateUser)
    app.get('/:username/workspace', users.GetUsersWorkspace)
    app.put('/:username/workspace/add-notebook', users.UpdateUsersNotebooks)
    app.put('/:username/workspace/add-notepage', users.UpdateUsersNotepages)

    return app
}

const user = {
    username: 'testing',
    password: 'testing'
}
