import express, { Request, Response, Router } from 'express'
import { checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById, createNewsletterUser, deleteNewsletterUserByEmail, getAllNewsletterUsers, getNewsletterUserByEmail, updateNewsletterUserByEmail, updateNewsletterUserById } from '../services/newsletterUser.service'
import { validateEmail } from '../utils/verification.helper'
import { ErrorMessage } from '../structures/types'
import { NewsletterUser } from '../models/newsletterUser.model'
import { CreateNewsletterUser, DeleteNewsletterUserByEmail, GetAllNewsletterUsers, GetNewsletterUserByEmail, PatchNewsletterUserByEmail, PatchNewsletterUserById } from '../controllers/newsletterUser.controller'

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
newsletterRouter.delete('/newsletter/:email', DeleteNewsletterUserByEmail)