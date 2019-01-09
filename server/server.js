require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

// const middleware
const auth = require('./middleware/authMiddleware')

// controllers
const ac = require('./contollers/authContoller')
const treasureController = require('./contollers/treasureController')

const app = express()

// middleware
app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))

// endpoints
app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)

app.get('/api/treasure/dragon', treasureController.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureController.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureController.getAllTreasure)

// connect to database
massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(SERVER_PORT, () => {
        console.log(`Listening on port ${SERVER_PORT}`)
    })
})