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
