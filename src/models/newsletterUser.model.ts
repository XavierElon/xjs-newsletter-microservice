import * as mongoose from 'mongoose'
import { ErrorMessage } from '../structures/types'
import { validateEmail } from '../utils/verification.helper'

const error = new ErrorMessage()

const newsletterUserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    validate: {
      validator: validateEmail,
      message: error.email
    }
  },
  subscribed: {
    type: Boolean,
    required: true,
  },
  date: { type: Date, default: Date.now }
})

export const NewsletterUser = mongoose.model('NewsletterUser', newsletterUserSchema);


