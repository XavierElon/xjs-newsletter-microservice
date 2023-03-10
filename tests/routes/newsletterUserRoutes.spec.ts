import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import request from 'supertest'
import sinon from 'sinon'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import { newsletterRouter } from '../../src/routes/newsletterUser.routes'
import { NewsletterUser } from '../../src/models/newsletterUser.model'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use('/', newsletterRouter)

describe('Newsletter Routes', () => {
    console.log(process.env.HOST)
})