import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import dotenv from 'dotenv'
import { connectToDatabase } from '../../src/connections/mongodb'
import { getAllNewsletterUsers, getNewsletterUserByEmail, createNewsletterUser, checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById,
            updateNewsletterUserByEmail, updateNewsletterUserById, getNewsletterUserById, deleteNewsletterUserById, deleteNewsletterUserByEmail } from '../../src/services/newsletterUser.service'
import { NewsletterUser } from '../../src/models/newsletterUser.model'
import { NewsletterUserMocks } from '../__mocks__/NewsletterUser.data'

dotenv.config()

describe('Newsletter User Services Suite', () => {
    let userId: string
    let userEmail: string = 'xavier@test.com'
    const newEmail: string = 'elonmusk@gmail.com'
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
    
    it('should create a newsletter user', async () => {
        const res = await createNewsletterUser(NewsletterUserMocks[0])
        await createNewsletterUser(NewsletterUserMocks[1])
        expect(res.email).to.equal(userEmail)
    })

    it('should not create a newsletter user', async () => {
        // expect(await createNewsletterUser({ name: 'steve' })).to.throw('')
    })

    it('should return all newsletter users (2)', async () => {
        const res = await getAllNewsletterUsers()
        console.log(res)
        expect(res.length).to.equal(2)
    })

    it('should return a single user by email', async () => {
        const res = await getNewsletterUserByEmail(userEmail)
        console.log(res)
        userId = res._id
        expect(res.email).to.equal(userEmail)
    })

    it('should check to see if user exists by email and return true', async () => {
        const res: boolean = await checkIfNewsletterUserExistsByEmail(userEmail)
        expect(res).to.equal(true)
    })

    it('should check to see if user exists by email and return false', async () => {
        
    })

    it('should find a newsletter user by id', async () => {
        const res = await getNewsletterUserById(userId)
        expect(res._id.toString()).to.equal(userId.toString())
    })

    it('should update a newsletter user by email', async () => {
        const res = await updateNewsletterUserByEmail(userEmail, { email: newEmail })
        expect(res.email).to.equal(newEmail)
    })

    it('should update a newsletter user by id', async () => {
        const res = await updateNewsletterUserById(userId, { subscribed: false, date: Date.now() })
        expect(res.subscribed).to.equal(false)
    })

    it('should delete a newsletter user by email', async () => {
        await deleteNewsletterUserByEmail(newEmail)
        const result = await getAllNewsletterUsers()
        expect(result.length).to.equal(1)
        userId = result[0]._id
        expect(result[0].email).to.not.equal(newEmail)
    })

    it('should delete a newsletter user by id', async () => {
        await deleteNewsletterUserById(userId)
        const result = await getAllNewsletterUsers()
        expect(result.length).to.equal(0)
    })

})