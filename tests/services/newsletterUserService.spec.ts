import { expect } from 'chai'
import mongoose, { Model } from 'mongoose'
import sinon from 'sinon';
import dotenv from 'dotenv'
import { connectToDatabase } from '../../src/connections/mongodb'
import { getAllNewsletterUsers, getNewsletterUserByEmail, createNewsletterUser, checkIfNewsletterUserExistsByEmail, checkIfNewsletterUserExistsById,
            updateNewsletterUserByEmail, updateNewsletterUserById, getNewsletterUserById, deleteNewsletterUserById, deleteNewsletterUserByEmail } from '../../src/services/newsletterUser.service'
import { NewsletterUser } from '../../src/models/newsletterUser.model'
import { NewsletterUserMocks } from '../__mocks__/NewsletterUser.data'

dotenv.config()

describe('Newsletter User Services Suite', function() {
    let userId: string
    const badUserId = new mongoose.Types.ObjectId()
    let userEmail: string = 'xavier@test.com'
    const newEmail: string = 'elonmusk@gmail.com'
    const nonExistentEmail: string  = 'achillesflocka@gmail.com'
    const testDbUri: string = process.env.TEST_DB_URI!
    this.timeout(5000);

    before(async () => {
        try {
            await connectToDatabase(testDbUri as string)
        } catch (error) {
            console.log('Error in before hook: ' + error)
        }
    })

    after(async () => {
        // Empty database
        try {
            await NewsletterUser.deleteMany({})
            console.log('NEWSLETTER USERS DELETED');
            await mongoose.disconnect()
        } catch (error) {
            console.log('Error in after hook: ' + error)
        }
        
    })
    
    it('should create a newsletter user', async () => {
        const res = await createNewsletterUser(NewsletterUserMocks[0])
        await createNewsletterUser(NewsletterUserMocks[1])
        expect(res.email).to.equal(userEmail)
    })

    it('should return all newsletter users (3)', async () => {
        const res = await getAllNewsletterUsers()
        console.log(res)
        expect(res.length).to.equal(2)
    })

    it('should return a single user by email', async () => {
        const res = await getNewsletterUserByEmail(userEmail)
        console.log(res)
        userId = res._id
        expect(res.email).to.equal(userEmail)
    })

    it('should check to see if user exists by email and return true', async () => {
        const res: boolean = await checkIfNewsletterUserExistsByEmail(userEmail)
        expect(res).to.equal(true)
    })

    it('should check to see if user exists by email and return false', async () => {
        const res: boolean = await checkIfNewsletterUserExistsByEmail(nonExistentEmail)
        expect(res).to.equal(false)
    })

    it('should check to see if user exists by id and return true', async () => {
        const res: boolean = await checkIfNewsletterUserExistsById(userId)
        expect(res).to.equal(true)
    })

    it('should check to see if user exists by id and return false', async () => {
        const res: boolean = await checkIfNewsletterUserExistsById(badUserId.toString())
        expect(res).to.equal(false)
    })

    it('should find a newsletter user by id', async () => {
        const res = await getNewsletterUserById(userId)
        expect(res._id.toString()).to.equal(userId.toString())
    })

    it('should update a newsletter user by email', async () => {
        const res = await updateNewsletterUserByEmail(userEmail, { email: newEmail })
        expect(res.email).to.equal(newEmail)
    })

    it('should update a newsletter user by id', async () => {
        const res = await updateNewsletterUserById(userId, { subscribed: false, date: Date.now() })
        expect(res.subscribed).to.equal(false)
    })

    it('should delete a newsletter user by email', async () => {
        await deleteNewsletterUserByEmail(newEmail)
        const result = await getAllNewsletterUsers()
        expect(result.length).to.equal(1)
        userId = result[0]._id
        expect(result[0].email).to.not.equal(newEmail)
    })

    it('should delete a newsletter user by id', async () => {
        await deleteNewsletterUserById(userId)
        const result = await getAllNewsletterUsers()
        expect(result.length).to.equal(0)
    })

})

describe('Newsletter User Service Errors', () => {
    afterEach(() => {
      sinon.restore();
    });

    after(async () => {
        // Empty database
        try {
            // await NewsletterUser.deleteMany({})
            console.log('NEWSLETTER USERS DELETED');
            // await mongoose.disconnect()
        } catch (error) {
            console.log('Error in after hook: ' + error)
        }
        
    })
  
    it('should return null when an error occurs getting a newsletter user by email', async () => {
      const error = new Error('Forced error');
      const findOneStub = sinon.stub(NewsletterUser, 'findOne').throws(error);
  
      const email = 'test@example.com';
      const result = await getNewsletterUserByEmail(email);
  
      expect(result).to.be.null;
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ email })).to.be.true;
    });

    it('should return null when an error occurs getting a newsletter user by id', async () => {
        const error = new Error('Forced error');
        const findByIdStub = sinon.stub(NewsletterUser, 'findById').throws(error);
    
        const id = 'badid';
        const result = await getNewsletterUserById(id);
    
        expect(result).to.be.null;
        expect(findByIdStub.calledOnce).to.be.true;
        expect(findByIdStub.calledWith(id)).to.be.true;
      });

      it('should return an error when saving a newsletter user fails', async () => {
        // Create a fake newsletter user data object
        const newsletterUserData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
        };
    
        // Stub the save method of the NewsletterUser instance to throw an error
        const saveStub = sinon.stub(NewsletterUser.prototype, 'save');
        saveStub.rejects(new Error('Forced error'));
    
        // Call the createNewsletterUser function with the fake data
        try {
          await createNewsletterUser(newsletterUserData);
        } catch (error: any) {
          // Make assertions
          expect(error.message).to.equal('Malformed data');
        }
    
        // Verify that the save method was called once
        expect(saveStub.calledOnce).to.be.true;
      });

      it('should return false when seeing if a user exists by email', async () => {
        // Create a fake newsletter user data object
        const newsletterUserData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
        };
    
        // Stub the save method of the NewsletterUser instance to throw an error
        const saveStub = sinon.stub(NewsletterUser.prototype, 'save');
        saveStub.rejects(new Error('Forced error'));
    
        // Call the createNewsletterUser function with the fake data
        try {
          await createNewsletterUser(newsletterUserData);
        } catch (error: any) {
          // Make assertions
          expect(error.message).to.equal('Malformed data');
        }
    
        // Verify that the save method was called once
        expect(saveStub.calledOnce).to.be.true;
      });

      it('should return an error when retrieving all newsletter users fails', async () => {
        // Stub the find method of the NewsletterUser model to throw an error
        const findStub = sinon.stub(NewsletterUser, 'find');
        findStub.throws(new Error('Forced error'));
    
        try {
          // Call the getAllNewsletterUsers function
          const result = await getAllNewsletterUsers();
        } catch (error: any) {
          // Make assertions
          expect(error.message).to.equal('No users found');
        }
    
        // Verify that the find method was called once
        expect(findStub.calledOnce).to.be.true;
      });

      it('should return null when an error occurs updating user by email', async () => {
        const email = 'test@example.com';
        const update = { subscribed: false };
        const error = new Error('Forced error');
    
        const findOneAndUpdateStub = sinon.stub(NewsletterUser, 'findOneAndUpdate').throws(error);
    
        const result = await updateNewsletterUserByEmail(email, update);
    
        expect(result).to.be.null;
        expect(findOneAndUpdateStub.calledOnceWith({ email }, update, { new: true })).to.be.true;
      });

    //   it('should handle error when updating a newsletter user by id', async () => {
    //     const id = 'someId';
    //     const update = { field: 'newValue' };
    
    //     const error = new Error('Forced error');
    //     const findOneAndUpdateStub = sinon.stub(NewsletterUser, 'findOneAndUpdate').throws(error);
    
    //     try {
    //       await updateNewsletterUserById(id, update);
    //     } catch (error: any) {
    //       expect(error.message).to.equal('Bad data');
    //     }
    
    //     expect(findOneAndUpdateStub.calledOnce).to.be.true;
    //     expect(findOneAndUpdateStub.calledWith({ _id: id }, sinon.match.any, sinon.match.any)).to.be.true;
    //   });

      it('should return an error when deleting a newsletter user by email fails', async () => {
        const email = 'test@example.com';
        const error = new Error('Forced error');
    
        const findOneAndDeleteStub = sinon.stub(NewsletterUser, 'findOneAndDelete').throws(error);
    
        try {
          await deleteNewsletterUserByEmail(email);
        } catch (error: any) {
          expect(error.message).to.equal('Bad data');
        }
    
        expect(findOneAndDeleteStub.calledOnceWith({ email })).to.be.true;
      });

      it('should return an error when deleting a newsletter user by id fails', async () => {
        const id = '123';
        const error = new Error('Forced error');
    
        const findOneAndDeleteStub = sinon.stub(NewsletterUser, 'findOneAndDelete').throws(error);
    
        try {
          await deleteNewsletterUserById(id);
        } catch (error: any) {
          expect(error.message).to.equal('Bad data');
        }
    
        expect(findOneAndDeleteStub.calledOnceWith({ _id: id })).to.be.true;
      });
    
  });