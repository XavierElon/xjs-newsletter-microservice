import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import request from 'supertest'
import sinon from 'sinon'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import { connectToDatabase } from '../../src/connections/mongodb'
import { newsletterRouter } from '../../src/routes/newsletterUser.routes'
import { NewsletterUser } from '../../src/models/newsletterUser.model'
import { NewsletterUserMocks } from '../__mocks__/NewsletterUser.data'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use('/', newsletterRouter)

describe('Newsletter Routes', () => {
    console.log(NewsletterUserMocks)
    const testDbUri: string = process.env.TEST_DB_URI!

    before(async () => {

        await connectToDatabase(testDbUri as string)
    })

    after(async () => {
        console.log('after')
        await mongoose.disconnect()
    })

    it('test', () => {
        console.log('testing')
    })
})