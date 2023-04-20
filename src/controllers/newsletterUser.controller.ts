import { Request, Response } from 'express'
import { validateEmail } from '../utils/verification.helper'
import { ErrorMessage } from '../structures/types'
import { NewsletterUser } from '../models/newsletterUser.model'
import { checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById, createNewsletterUser, deleteNewsletterUserByEmail, getAllNewsletterUsers, getNewsletterUserByEmail, updateNewsletterUserByEmail, updateNewsletterUserById } from '../services/newsletterUser.service'

const errorMessage = new ErrorMessage()

export const GetAllNewsletterUsers = async (req: Request, res: Response) => {
    try {
        const result = await getAllNewsletterUsers()
        res.status(200).json({ users: result })
    } catch (error) {
        console.log(`Error retrieving all users: ${error}`)
        res.status(500).json({ message: 'Error getting users', error})
    }
}

export const GetNewsletterUserByEmail = async (req: Request, res: Response) => {
    const email: string = req.params.email
    
    const userExists: boolean = await checkIfNewsletterUserExistsByEmail(email)
    const emailIsValid: boolean = validateEmail(email)
    if(!emailIsValid) {
        res.status(422).json({ message: errorMessage.email })
    }
    else if (userExists) {
        try {
            const user = await getNewsletterUserByEmail(email)
            res.status(200).json({ user: user})
        } catch (error) {
            console.log(`Error retrieving user ${error}`)
            res.status(500).json({ message: `Error retrieving ${email}`, error})
        }
    } else {
        console.log(`Email ${email} does not exist`)
        res.status(404).json({ message: `${email} does not exist in database`})
    }
}

export const CreateNewsLetterUser = async (req: Request, res: Response) => {
    const userData: typeof NewsletterUser = req.body
    const email: string = req.body.email
    const emailIsValid: boolean = (email != null) ? validateEmail(email) : true
    const userExists: boolean = await checkIfNewsletterUserExistsByEmail(email)

    if (!emailIsValid) {
        res.status(422).json({ mesage: errorMessage.email})
    } else if (userExists) {
        console.error(`${email} already exists.`)
        res.status(400).json({ message: `${email} already exists` })
    } else {
        try {
            const result = await createNewsletterUser(userData)
            res.status(201).json({ message: 'User created', data: userData })
        } catch (error) {
            console.log('Error creating user: ', error)
            res.status(500).json({ message: 'Error creating user', error })
        }
    }
}