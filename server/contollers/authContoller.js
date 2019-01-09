const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { username, password, isAdmin } = req.body
        const db = req.app.get('db')
        const result = await db.get_user([username])
        const existingUser = result[0]
        if (existingUser) {
            res.status(409).send('Username taken')
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const user = await db.register_user([isAdmin, username, hash])
            req.session.user = {
                isAdmin: user[0].is_admin,
                id: user[0].id,
                username: user[0].username
            }
            res.status(201).send(req.session.user)
        }
    },
    login: async (req, res) => {
        const { username, password } = req.body
        const db = req.app.get('db')
        const user = await db.get_user([username])
        if (user.length === 0) {
            res.status(401).send('User not found. Please register as a new user before logging in.')
        } else {
            const isAuthenticated = bcrypt.compareSync(password, user[0].hash)
            if (isAuthenticated) {
                req.session.user = {
                    isAdmin: user[0].is_admin,
                    id: user[0].id,
                    username: user[0].username
                }
                res.status(200).send(req.session.user)
            } else {
                res.status(403).send('Incorrect password')
            }
        }
    },
    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}