import express, { Request, Response, Router } from 'express'
import { checkIfNewsletterUserExists, createNewsletterUser, deleteNewsletterUser, getAllNewsletterUsers, getNewsletterUserByEmail, updateNewsletterUserByEmail } from '../services/newsletterUser.service'
import { validateEmail } from '../utils/verification.helper'
import { ErrorMessage } from '../structures/types'

const errorMessage = new ErrorMessage()

export const newsletterRouter: Router = express.Router()

// Get all Newsletter Users
newsletterRouter.get('/newsletter', async (req: Request, res: Response) => {
    console.log('Retrieving all users')
    await getAllNewsletterUsers().then((result) => {
        console.log('Retrieved all users')
        res.status(201).json({ message: 'All users', users: result})
    })
    .catch((error) => {
        console.log(`Error retrieving all users: ${error}`)
        res.status(500).json({ message: 'Error getting users', error})
    })
})

// Get Newsletter User by email
newsletterRouter.get('/newsletter/:email', async (req: Request, res: Response) => {
    const email = req.params.email
    const userExists =  await checkIfNewsletterUserExists(email)
    if (userExists) {
        await getNewsletterUserByEmail(email).then((result) => {
            console.log(`Getting user by email ${email}`)
            console.log(result)
            res.status(201).json({ user: result })
        })
        .catch((error) => {
            console.log(`Error retrieving user ${error}`)
            res.status(500).json({ message: 'Error getting user', error})
        })
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
    const userExists = await checkIfNewsletterUserExists(email)

    if (!emailIsValid) {
        res.status(401).json({ mesage: errorMessage.email})
    }
    if (userExists) {
        res.status(400).json({ message: 'User already exists' })
    } else {
        createNewsletterUser(userData)
            .then((result) => {
                console.log('User created successfully: ', result)
                res.status(201).json({ message: 'User created', data: userData })
            })
            .catch((error) => {
                console.log('Error creating user: ', error)
                res.status(500).json({ message: 'Error creating user', error })
            })
    }
})

// Patch Newsletter User by email
newsletterRouter.patch('/newsletter/:email', async (req: Request, res: Response) => {
    const email = req.params.email
    const userExists = await checkIfNewsletterUserExists(email)
    console.log(req.body)
    if (userExists) {
        try {
            const result = await updateNewsletterUserByEmail(email, req.body)
            console.log(`User updated: ${result}`)
            console.log(result)
            res.status(200).send({ message: 'User updated', result: result })
        } catch (error) {
            console.error(`Error updating user: ${error}`)
            return res.status(500).send({ error: `Server error: ${error}`})
        }
    }
})

// Pat

// Delete Newsletter User
newsletterRouter.delete('/newsletter/:email', async (req: Request, res: Response) => {
    const email = req.params.email
    const userExists = await checkIfNewsletterUserExists(email)

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

// // Update a user by ID
// updateRouter.put('/update/:id', async (req: Request, res: Response) => {
//     try {
//         const id = req.params.id;
//         const update = req.body;s
//         // Find the user by ID and update its properties
//         const updatedUser = updateUser(id, update);
//         if (!updatedUser) {
//             return res.status(404).send({ error: 'User not found' });
//         } else {
//             return res.status(200).send({ updatedUser, message: 'User updated' });
//         }
//     } catch (error) {
//         console.error(`Error updating user: ${error}`);
//         return res.status(500).send({ error: 'Server error' });
//     }
// });


// /*Verify user credentials against the database and login*/
// loginRouter.post('/login', async (req: Request, res: Response) => {
//     const { username, password } = req.body

//     const isValid = await verifyUser(username, password)

//     if (isValid) {
//         res.status(200).json({ message: 'Login successful' })
//     } else {
//         res.status(401).json({ message: 'Incorrect username or password' })
//     }
// })


// // Delete user by email endpoint
// deleteRouter.delete('/delete/:email', async (req, res) => {
//     const email = req.params.email;
//     try {
//         const deletedUser = await deleteUser(email);
//         if (!deletedUser) {
//             return res.status(404).send(`User with email ${email} not found`);
//         }
//         return res.send(`Deleted user: ${deletedUser}`);
//     } catch (err) {
//         console.error(`Error deleting user with email ${email}:`, err);
//         return res.status(500).send('Error deleting user');
//     }
// });