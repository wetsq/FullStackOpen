const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', (request, response) => {
  console.log('getted')
    Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1})
      .then(blogs => {
        response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response) => {
    const user = request.user
    if (user === undefined) {
      return response.status(401).end()
    }
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      comments: [],
      user: user._id
    })

    if (blog.title === undefined || blog.url === undefined) {
      return response.status(400).end()
    } else {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } else {
    return response.status(401).json({ error: 'removal not allowed to user' })
  }
})

blogsRouter.put('/:id', (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
    user: body.user
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
})

module.exports = blogsRouter