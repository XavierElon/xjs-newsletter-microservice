import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import request from 'supertest'
import sinon from 'sinon'
import dotenv from 'dotenv'
import express, { Express, Response } from 'express'
import { ObjectId } from 'mongoose'
import { connectToDatabase } from '../../src/connections/mongodb'
import { getAllNewsletterUsers, getNewsletterUserByEmail, createNewsletterUser, checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById,
            updateNewsletterUserByEmail, updateNewsletterUserById, deleteNewsletterUser } from '../../src/services/newsletterUser.service'
import { NewsletterUser } from '../../src/models/newsletterUser.model'
import { NewsletterUserMocks } from '../__mocks__/NewsletterUser.data'

dotenv.config()

describe('Newsletter User Services Suite', () => {
    let userId: ObjectId
    let userEmail: string = 'xavier@test.com'
    const newEmail: string = 'elonmusk@gmail.com'
    const nonExistentEmail: string  = 'achillesflocka@gmail.com'
    const existingEmail: string = 'achilles@gmail.com'
    const invalidEmail: string = 'achillesflocka@gmail'
    const testDbUri: string = process.env.TEST_DB_URI!

    before(async () => {
        await connectToDatabase(testDbUri as string)
    })

    after(async () => {
        // Empty database
        NewsletterUser.deleteMany({}, () => {
            console.log('NEWSLETTER USERS DELETED')
        })
        await mongoose.disconnect()
    })

    it('should return all newsletter users (2)', async () => {

    })

    it('should return a single user by email', async () => {

    })

    it('should create a newsletter user', async () => {

    })

    it('should find a newsletter user by id', async () => {

    })

    it('should update a newsletter user by email', async () => {

    })

    it('should update a newsletter user by id', async () => {

    })

    it('should delete a newsletter user by email', async () => {
        
    })


})