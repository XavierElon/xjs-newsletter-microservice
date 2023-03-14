import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import request from 'supertest'
import sinon from 'sinon'
import dotenv from 'dotenv'
import express, { Express, Response } from 'express'
import { ObjectId } from 'mongoose'
import { connectToDatabase } from '../../src/connections/mongodb'
import { newsletterRouter } from '../../src/routes/newsletterUser.routes'
import { NewsletterUser } from '../../src/models/newsletterUser.model'
import { NewsletterUserMocks } from '../__mocks__/NewsletterUser.data'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use('/', newsletterRouter)

describe('Newsletter Routes', () => {
    let userId: ObjectId
    let userEmail: string = 'xavier@test.com'
    const newEmail: string = 'elonmusk@gmail.com'
    const nonExistentEmail: string  = 'achillesflocka@gmail.com'
    const existingEmail: string = 'achilles@gmail.com'
    const invalidEmail: string = 'achillesflocka@gmail'
    const testDbUri: string = process.env.TEST_DB_URI!

    before(async () => {
        // NewsletterUser.deleteMany({})
        await connectToDatabase(testDbUri as string)
    })

    after(async () => {
        // Empty database
        NewsletterUser.deleteMany({}, () => {
            console.log('NEWSLETTER USERS DELETED')
        })
        await mongoose.disconnect()
    })

    it('should add 2 newsletter users and return 201 status code for both', async () => {
        const res = await request(app).post('/newsletter').send(NewsletterUserMocks[0])
        expect(res.status).to.equal(201)
        const res2 = await request(app).post('/newsletter').send(NewsletterUserMocks[1])
        expect(res2.status).to.equal(201)
    })

    it('should return 2 newsletter users',async () => {
        const res = await request(app).get('/newsletter')
        expect(res.body.users.length).to.equal(2)
    })

    it('should find a newletter user by email with 200 status code', async () => {
        const res  = await request(app).get(`/newsletter/${userEmail}`)
        expect(res.status).to.equal(200)
    })

    it('should update a newsletter user by email with 201 status code', async () => {
        const newUser = {
            email: newEmail
        }
        const res = await request(app).patch(`/newsletter/${userEmail}`).send(newUser)
        expect(res.status).to.equal(200)
        expect(res.body.result.email).to.equal(newUser.email)
        expect(res.body.result.subscribed).to.equal(true)
    })

    it('should update newsletter user by id with 200 status code and subscribed should be changed to false', async () => {
        const newUser = {
            email: newEmail,
            subscribed: false
        }
        const res = await request(app).get('/newsletter')
        userId = res.body.users[0]._id
        const response = await request(app).patch(`/newsletter/update/${userId}`).send(newUser)
        expect(response.status).to.equal(200)
        expect(response.body.result.subscribed).to.equal(false)
    })

    it('should delete a user by email with 200 status code', async () => {
        const email: string = 'elonmusk@gmail.com'
        const res = await request(app).delete(`/newsletter/${email}`)
        expect(res.status).to.equal(200)
    })

    it('should return one user', async () => {
        const res = await request(app).get('/newsletter')
        expect(res.body.users.length).to.equal(1)
    })

    it('should find email invalid and return 422 status code', async () => {
        const res = await request(app).get(`/newsletter/${invalidEmail}`)
        expect(res.status).to.equal(422)
    })

    it('should not get user by email and return 404 status code', async () => {
        const res = await request(app).get(`/newsletter/${nonExistentEmail}`)
        expect(res.status).to.equal(404)
    })

    it('should not create a user because email is not valid and return 422 status code', async () => {
        const res = await request(app).post('/newsletter').send({ email: invalidEmail, subscribed: true })
        expect(res.status).to.equal(422)
    })

    it('should not create new user because email already exists and return 400 status code', async () => {
        const res = await request(app).post('/newsletter').send({ email: existingEmail, subscribed: true })
        expect(res.status).to.equal(400)
    })

    it('should not update user by email because email is not valid and return 422 status code', async () => {
        const res = await request(app).patch(`/newsletter/${existingEmail}`).send({ email: invalidEmail })
        expect(res.status).to.equal(422)
    })

    it('should not update user because the email does not exist and return 404 status code', async () => {
        const res = await request(app).patch(`/newsletter/${nonExistentEmail}`).send({ subscribed: false })
        expect(res.status).to.equal(404)
    })

    it('should not patch user because the id does not exist and return 404 status code', async () => {
        const res = await request(app).patch(`/newsletter/${userId}`).send ({ subscrbied: false })
        expect(res.status).to.equal(404)
    })

    it('should not delete user because the email supplied is not valid and return 422 status code', async () => {
        const res = await request(app).delete(`/newsletter/${invalidEmail}`)
        expect(res.status).to.equal(422)
    })

    it ('should not delete user because the email does not exist adn return 404 status code', async () => {
        const res = await request(app).delete(`/newsletter/${nonExistentEmail}`)
        expect(res.status).to.equal(404)
    })
})