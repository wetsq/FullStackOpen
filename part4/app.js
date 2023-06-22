const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
mongoose.set('strictQuery', false)
require('dotenv').config()

mongoose.connect(config.MONGODB_URI)

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if(authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()
}

const userExtractor = async (request, response, next) => {
    if (request.token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken) {
            return response.status(401).json({ error: 'invalid token' })
        }
        request.user = await User.findById(decodedToken.id)
    }
    next()
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app