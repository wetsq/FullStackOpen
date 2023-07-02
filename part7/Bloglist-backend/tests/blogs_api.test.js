const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')
const User = require('../models/user')

const initialUsers = [
    {
        username: "veesal",
        name: "Veeti Salminen",
        password: "salasana"
    },
    {
        username: "tkari",
        name: "Teemu teekkari",
        password: "salasana123"
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await api.post('/api/users').send(initialUsers[0])
    const users =  await api.get('/api/users')

    const initialBlogs = [
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            user: users.body[0].id
        },
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Obama',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 10
        }
    ]

    await Blog.insertMany(initialBlogs)
})

test('returns right number of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
})

test('has field id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid note can be added with token', async () => {

    const user = await api.get('/api/users')
    const user_id = user.body._id
    const newBlog = {
        title: 'otsikko',
        author: 'tekijä',
        url: 'www.joojoo.com',
        likes: 50,
        user: user_id
    }

    const response = await api.post('/api/login').send(
        {
            "username": "veesal",
            "password": "salasana"
        }
    )
    const token = response.body.token
    await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
    
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(2 + 1)

    const titles = blogsAtEnd.body.map(blog => blog.title)
    expect(titles).toContain('otsikko')
})

test('a valid note can not be added without a token', async () => {

    const user = await api.get('/api/users')
    const user_id = user.body._id
    const newBlog = {
        title: 'otsikko',
        author: 'tekijä',
        url: 'www.joojoo.com',
        likes: 50,
        user: user_id
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(2)
})

test('default likes is 0', async () => {
    const user = await api.get('/api/users')
    const user_id = user.body._id
    const newBlog = {
        title: 'otsikko',
        author: 'tekijä',
        url: 'www.joojoo.com',
        user: user_id
    }

    const response = await api.post('/api/login').send(
        {
            "username": "veesal",
            "password": "salasana"
        }
    )
    const token = response.body.token
    await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)

    const result = await api.get('/api/blogs')
    const blogs = result.body

    const addedNewBlog = blogs.find(blog => blog.title === newBlog.title)
    expect(addedNewBlog.likes).toBe(0)
})

test('can not add invalid blog', async () =>{
    const user = await api.get('/api/users')
    const user_id = user.body._id
    const newBlog = {
        title: 'otsikko',
        author: 'tekijä',
        user: user_id
    }

    const response = await api.post('/api/login').send(
        {
            "username": "veesal",
            "password": "salasana"
        }
    )
    const token = response.body.token
    await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)
})

test('blog can be deleted', async () => {
    const blogs = await api.get('/api/blogs')

    const response = await api.post('/api/login').send(
        {
            "username": "veesal",
            "password": "salasana"
        }
    )
    const token = response.body.token
    
    await api
        .delete(`/api/blogs/${blogs.body[0].id}`).set('Authorization', token)
        
    const result = await api.get('/api/blogs')
    const newBlogs = result.body
    expect(newBlogs.length).toBe(blogs.body.length - 1)
})

test('blog can be updated', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[1].id

    const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Obama',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 500
    }

    await api
        .put(`/api/blogs/${id}`)
        .send(newBlog)

    const result = await api.get('/api/blogs')
    const newBlogs = result.body
    expect(newBlogs[1].likes).toBe(500)

})

afterAll(async () => {
    await mongoose.connection.close()
})