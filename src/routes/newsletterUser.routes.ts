import express, { Request, Response, Router } from 'express'
import { checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById, createNewsletterUser, deleteNewsletterUserByEmail, getAllNewsletterUsers, getNewsletterUserByEmail, updateNewsletterUserByEmail, updateNewsletterUserById } from '../services/newsletterUser.service'
import { validateEmail } from '../utils/verification.helper'
import { ErrorMessage } from '../structures/types'
import { NewsletterUser } from '../models/newsletterUser.model'
import { CreateNewsletterUser, GetAllNewsletterUsers, GetNewsletterUserByEmail, PatchNewsletterUserByEmail, PatchNewsletterUserById } from '../controllers/newsletterUser.controller'

const errorMessage = new ErrorMessage()

export const newsletterRouter: Router = express.Router()

// Get all Newsletter Users
newsletterRouter.get('/newsletter', GetAllNewsletterUsers)

// Get Newsletter User by email
newsletterRouter.get('/newsletter/:email', GetNewsletterUserByEmail)

// Create a User
newsletterRouter.post('/newsletter', CreateNewsletterUser)

// Patch Newsletter User by email
newsletterRouter.patch('/newsletter/:email', PatchNewsletterUserByEmail)

// Patch Newsletter User by id
newsletterRouter.patch('/newsletter/update/:id', PatchNewsletterUserById)

// Delete Newsletter User
newsletterRouter.delete('/newsletter/:email', async (req: Request, res: Response) => {
    const email: string = req.params.email
    const isValidEmail: boolean= validateEmail(email)
    const userExists: boolean = await checkIfNewsletterUserExistsByEmail(email)

    if (!isValidEmail) {
        res.status(422).json({ message: errorMessage.email })
    } else if (userExists) {
        try {
            const result = await deleteNewsletterUserByEmail(email)
            console.log(`Email ${result} succesfully deleted from database`)
            res.status(200).json({ message: `Email ${result} successfully deleted`})
        } catch (error) {
            console.log(`Error deleteing ${email}: ${error}`)
            res.status(500).json({ message: `Error deleting ${email}`, error})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(404).json({ message: `${email} does not exist in database`})
    }
})