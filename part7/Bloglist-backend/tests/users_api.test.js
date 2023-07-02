const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')


const initialUsers = [
    {
        username: 'veesal',
        name: 'Veeti Salminen',
        passwordHash: 'salasana'
    },
    {
        username: 'tkari',
        name: 'Teemu Teekkari',
        passwordHash: 'teekkari'
    }
]

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
})

describe('invalid user credentials cant be added', () => {
    test('when username is missing', async () => {
        const usersAtStart = await api.get('/api/users')
        const usersAtStartBody = usersAtStart.body

        const newUser = {
            name: 'jarkko',
            password: 'joojoo'
        }

        const response = await api.post('/api/users')
                                .send(newUser)
                                .expect(400)
        
        expect(response.error.text).toContain('username or password missing')

        const usersAtEnd = await api.get('/api/users')
        const usersAtEndBody = usersAtEnd.body
        expect(usersAtEndBody).toHaveLength(usersAtStartBody.length)
    })
    test('when password is missing', async () => {
        const usersAtStart = await api.get('/api/users')
        const usersAtStartBody = usersAtStart.body

        const newUser = {
            username: 'jarkkoj',
            name: 'jarkko',
        }

        const response = await api.post('/api/users')
                                .send(newUser)
                                .expect(400)
        
        expect(response.error.text).toContain('username or password missing')

        const usersAtEnd = await api.get('/api/users')
        const usersAtEndBody = usersAtEnd.body
        expect(usersAtEndBody).toHaveLength(usersAtStartBody.length)
    })
    test('when username is too short', async () => {
        const usersAtStart = await api.get('/api/users')
        const usersAtStartBody = usersAtStart.body

        const newUser = {
            username: 'ja',
            name: 'jarkko',
            password: 'salasana'
        }

        const response = await api.post('/api/users')
                                .send(newUser)
                                .expect(400)
        
        expect(response.error.text).toContain('username or password too short')

        const usersAtEnd = await api.get('/api/users')
        const usersAtEndBody = usersAtEnd.body
        expect(usersAtEndBody).toHaveLength(usersAtStartBody.length)
    })
    test('when password is too short', async () => {
        const usersAtStart = await api.get('/api/users')
        const usersAtStartBody = usersAtStart.body

        const newUser = {
            username: 'jaakko',
            name: 'jarkko',
            password: 'sa'
        }

        const response = await api.post('/api/users')
                                .send(newUser)
                                .expect(400)
        
        expect(response.error.text).toContain('username or password too short')

        const usersAtEnd = await api.get('/api/users')
        const usersAtEndBody = usersAtEnd.body
        expect(usersAtEndBody).toHaveLength(usersAtStartBody.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})