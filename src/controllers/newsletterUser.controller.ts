import { Request, Response } from 'express'
import { checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById, createNewsletterUser, deleteNewsletterUserByEmail, getAllNewsletterUsers, getNewsletterUserByEmail, updateNewsletterUserByEmail, updateNewsletterUserById } from '../services/newsletterUser.service'

export const GetAllNewsletterUsers = async (req: Request, res: Response) => {
    try {
        const result = await getAllNewsletterUsers()
        res.status(200).json({ users: result })
    } catch (error) {
        console.log(`Error retrieving all users: ${error}`)
        res.status(500).json({ message: 'Error getting users', error})
    }
}

