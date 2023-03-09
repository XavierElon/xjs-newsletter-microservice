import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { connectToDatabase } from './src/connections/mongodb'
import { newsletterRouter } from './src/routes/newsletterUser.routes'

dotenv.config()

const app: Express = express()
const port: string = process.env.PORT || '420'
const host: string = process.env.HOST || 'http://localhost:'
const dbUri: string = process.env.MONGO_ATLAS_URI || ''
const dbName: string = process.env.DB_NAME || ''
const UriQueryParam: string = process.env.QUERY_PARAMETERS || ''

// Body parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(newsletterRouter)

app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({ message: 'Achilles' })
})

try{
    app.listen(port, (): void => {
        /* eslint-disable no-console */
        console.log(`Connected successfully to ${host}${port}`)
    })
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`)
    /* eslint-enable no-console */
}

connectToDatabase(dbUri + dbName + UriQueryParam)
