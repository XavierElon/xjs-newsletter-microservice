import express, { Request, Response, Router } from 'express'
import { checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById, createNewsletterUser, deleteNewsletterUser, getAllNewsletterUsers, getNewsletterUserByEmail, updateNewsletterUserByEmail, updateNewsletterUserById } from '../services/newsletterUser.service'
import { validateEmail } from '../utils/verification.helper'
import { ErrorMessage } from '../structures/types'

const errorMessage = new ErrorMessage()

export const newsletterRouter: Router = express.Router()

// Get all Newsletter Users
newsletterRouter.get('/newsletter', async (req: Request, res: Response) => {
    try {
        const result = await getAllNewsletterUsers()
        res.status(201).json({ users: result })
    } catch (error) {
        console.log(`Error retrieving all users: ${error}`)
        res.status(500).json({ message: 'Error getting users', error})
    }
})

// Get Newsletter User by email
newsletterRouter.get('/newsletter/:email', async (req: Request, res: Response) => {
    const email = req.params.email
    const userExists =  await checkIfNewsletterUserExistsByEmail(email)
    if (userExists) {
        try {
            const user = await getNewsletterUserByEmail(email)
            res.status(201).json({ user: user})
        } catch (error) {
            console.log(`Error retrieving user ${error}`)
            res.status(500).json({ message: `Error retrieving ${email}`, error})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(401).json({ message: `${email} does not exist in database`})
    }
})

// Create a User
newsletterRouter.post('/newsletter', async (req: Request, res: Response) => {
    const userData = req.body
    const email = req.body.email
    const emailIsValid = validateEmail(email)
    const userExists = await checkIfNewsletterUserExistsByEmail(email)

    if (!emailIsValid) {
        res.status(401).json({ mesage: errorMessage.email})
    }
    if (userExists) {
        console.error(`${email} already exists.`)
        res.status(400).json({ message: `${email} already exists` })
    } else {
        try {
            const result = await createNewsletterUser(userData)
            console.log('User created successfully: ', result)
            res.status(201).json({ message: 'User created', data: userData })
        } catch (error) {
            console.log('Error creating user: ', error)
            res.status(500).json({ message: 'Error creating user', error })
        }
    }
})

// Patch Newsletter User by email
newsletterRouter.patch('/newsletter/:email', async (req: Request, res: Response) => {
    const email = req.params.email
    const userExists = await checkIfNewsletterUserExistsByEmail(email)
    console.log(req.body)
    if (userExists) {
        try {
            const updatedUser = await updateNewsletterUserByEmail(email, req.body)
            console.log(`User updated: ${updatedUser}`)
            res.status(200).send({ message: 'User updated', result: updatedUser })
        } catch (error) {
            console.error(`Error updating ${email}: ${error}`)
            return res.status(500).send({ error: `Server error: ${error}`})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(401).json({ message: `${email} does not exist in database`})
    }
})

// Patch Newsletter User by id
newsletterRouter.patch('/newsletter/update/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const userExists = await checkIfNewsletterUserExistsById(id)
    if (userExists) {
        try {
            const updatedUser = await updateNewsletterUserById(id, req.body)
            console.log(`User updated: ${updatedUser}`)
            res.status(200).send({ message: `User with id ${id} updated`, result: updatedUser})
        } catch (error) {
            console.error(`Error updating user with id ${id}: ${error}`)
        }
    } else {
        console.log(`User with ${id} does not exist`)
        res.status(401).json({ message: `User with ${id} does not exist in database`})
    }
})

// Delete Newsletter User
newsletterRouter.delete('/newsletter/:email', async (req: Request, res: Response) => {
    const email = req.params.email
    const userExists = await checkIfNewsletterUserExistsByEmail(email)

    if (userExists) {
        console.log(userExists)
        try {
            const result = await deleteNewsletterUser(email)
            console.log(`Email ${result} succesfully deleted from database`)
            res.status(201).json({ message: `Email ${result} successfully deleted`})
        } catch (error) {
            console.log(`Error deleteing ${email}: ${error}`)
            res.status(500).json({ message: `Error deleting ${email}`, error})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(401).json({ message: `${email} does not exist in database`})
    }
})