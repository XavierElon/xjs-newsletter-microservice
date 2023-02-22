import express, { Request, Response, Router } from 'express'
import { createNewsletterUser, getAllNewsletterUsers } from '../services/newsletterUser.service'

export const newsletterRouter: Router = express.Router()

// Get all Newsletter Users
newsletterRouter.get('/newsletter', async (req: Request, res: Response) => {
    console.log('here')
    getAllNewsletterUsers()
})

// Create a User
newsletterRouter.post('/newsletter', async (req: Request, res: Response) => {
    const userData = req.body
    // const userExists = await checkIfUserExists(userData.email)
    // if (userExists) {
    //     res.status(400).json({ message: 'User already exists' })
    // } else {
        createNewsletterUser(userData)
            .then((result) => {
                console.log('User created successfully: ', result)
                res.status(201).json({ message: 'User created', data: userData })
            })
            .catch((error) => {
                console.log('Error creating user: ', error)
                res.status(500).json({ message: 'Error creating user', error })
            })
    // }
})

// Delete Newsletter User


// // Update a user by ID
// updateRouter.put('/update/:id', async (req: Request, res: Response) => {
//     try {
//         const id = req.params.id;
//         const update = req.body;
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