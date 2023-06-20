const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (username === undefined || password === undefined) {
        return response.status(400).json({ error: 'username or password missing' })
    }

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'username or password too short' })
    }

    const users = await User.find({})
    const usernames = users.map(user => user.username)

    if (usernames.find(uname => uname === username)) {
        return response.status(400).json({ error: 'username already exists' })
    }


    const saltRounds = 11
    const passwordHash = await bcrypt.hash(password, saltRounds)


    const user = new User( {
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users)
})

usersRouter.put('/:id', (request, response) => {
    const body = request.body
  
    const user = {
        username: body.username,
        name: body.name,
        blogs: body.blogs
    }
  
    User.findByIdAndUpdate(request.params.id, user, { new: true })
      .then(updatedUser => {
        response.json(updatedUser)
      })
  })

module.exports = usersRouter