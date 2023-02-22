import { NewsletterUser } from '../models/newsletterUser.model'
import mongoose, { Model } from 'mongoose'

// GET All newsletter users
export const getAllNewsletterUsers = async (): Promise<typeof NewsletterUser[] | null> => {
  const User: Model<Document & typeof NewsletterUser> = mongoose.model('NewsletterUser')
  try {
    const all = await User.find()
    console.log(all)
    return all
  } catch (error) {
    console.error(`Error retrieving all newsletter users: ${error}`)
    return null
  }
}

export const getNewsletterUserByEmail =  async (email: string): Promise<typeof NewsletterUser | null>  => {
  const NewsletterUserModel: Model<Document & typeof NewsletterUser> = mongoose.model('NewsletterUser');
  try {
    const NewsletterUser = await NewsletterUserModel.findOne({ email });
    return NewsletterUser || null;
  } catch (error) {
    console.error(`Error while getting NewsletterUser by email: ${error}`);
    return null;
  }
}

/*
CREATE NewsletterUser
This function creates a new NewsletterUser using the NewsletterUserSchema and saves it to the database
*/
export const createNewsletterUser = async (NewsletterUserData: typeof NewsletterUser): Promise<any> => {
  const user = new NewsletterUser(NewsletterUserData)
  return user
    .save()
    .then((result: any) => {
      return Promise.resolve(result)
    })
    .catch((error: any) => {
      console.log('Error creating NewsletterUser: ', error)
      return Promise.reject(error)
    })
}

/*
CHECK IF NewsletterUser EXISTS 
check the NewsletterUsername against the database for duplicates before proceeding with creation of new NewsletterUser
*/
export const checkIfNewsletterUserExists = async (email: string) => {
  const existingNewsletterUser = await NewsletterUser.findOne({ email });
  if (existingNewsletterUser) {
    return true;
  }
  return false;
};

/*
UPDATE NewsletterUser INFORMATION
*/
export const updateNewsletterUserByEmail = async (email: string, update: Partial<typeof NewsletterUser>): Promise<typeof NewsletterUser | null> => {
  const NewsletterUserModel: Model<Document & typeof NewsletterUser> = mongoose.model('NewsletterUser');
  try {
    const updatedNewsletterUser = await NewsletterUserModel.findOneAndUpdate({ email: email }, update, { new: true });
    return updatedNewsletterUser;
  } catch (error) {
    console.error(`Error updating NewsletterUser: ${error}`);
    return null;
  }
};

/*
UPDATE NewsletterUser INFORMATION
*/
export const updateNewsletterUserById = async (id: string, update: Partial<typeof NewsletterUser>): Promise<typeof NewsletterUser | null> => {
  const NewsletterUserModel: Model<Document & typeof NewsletterUser> = mongoose.model('NewsletterUser');
  try {
    const updatedNewsletterUser = await NewsletterUserModel.findOneAndUpdate({ _id: id }, update, { new: true });
    return updatedNewsletterUser;
  } catch (error) {
    console.error(`Error updating NewsletterUser: ${error}`);
    return null;
  }
};

/*
DELETE NewsletterUser
*/
export const deleteNewsletterUser = async (email: string): Promise<typeof NewsletterUser | null> => {
  const NewsletterUserModel: Model<Document & typeof NewsletterUser> = mongoose.model('NewsletterUser');
  try {
    const deletedNewsletterUser = await NewsletterUserModel.findOneAndDelete({ email });
    return deletedNewsletterUser;
  } catch (err) {
    console.error(err);
    return null;
  }
}




