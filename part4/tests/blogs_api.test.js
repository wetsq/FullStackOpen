const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Obama',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 10
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Obama',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('returns right number of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('has field id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid note can be added', async () => {
    const newBlog = {
        title: 'otsikko',
        author: 'tekijä',
        url: 'www.joojoo.com',
        likes: 50
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
    
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAtEnd.body.map(blog => blog.title)
    expect(titles).toContain('otsikko')
})

test('default likes is 0', async () => {
    const newBlog = {
        title: 'otsikko',
        author: 'tekijä',
        url: 'www.joojoo.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const result = await api.get('/api/blogs')
    const blogs = result.body

    const addedNewBlog = blogs.find(blog => blog.title === newBlog.title)
    expect(addedNewBlog.likes).toBe(0)
})

test('can not add invalid blog', async () =>{
    const newBlog = {
        title: 'otsikko',
        author: 'tekijä',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('blog can be deleted', async () => {
    const blogs = await api.get('/api/blogs')
    
    await api
        .delete(`/api/blogs/${blogs.body[0].id}`)
        
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