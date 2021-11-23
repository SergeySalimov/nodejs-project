import mongoose from 'mongoose';
import UserModel from './models/user.model';

const DB_ADDRESS = 'mongodb://localhost/postman';
const MONGOOSE_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

export default {
  createANewUser: async function(user) {
    const { name, surname, email, password, sid } = user;
    
    if (email && password && surname && name && sid) {
      await mongoose.connect(DB_ADDRESS, MONGOOSE_OPTIONS);
      const newUser = new UserModel({
        name,
        surname,
        email,
        password,
        sid,
        createdAt: new Date(),
        lastEdited: new Date(),
        photoUrl: '',
        isConfirmed: false,
        isAdmin: false,
        isDeleted: false,
      });
  
      await newUser.save();
      
      mongoose.connection.close();
    } else {
      return Promise.reject();
    }
  },
  checkUserConfirmation: async function(sid) {
    if (!sid) {
      return Promise.reject();
    }
    
    await mongoose.connect(DB_ADDRESS, MONGOOSE_OPTIONS);
    const user = await UserModel.findOne({ sid });
    let status;
  
    if (user) {
      if (!user.isConfirmed) {
        user.isConfirmed = true;
        user.lastEdited = new Date();
  
        await user.save();
        status = 'done';
      } else {
        status = 'already';
      }
    } else {
      status = 'error';
    }
    
    mongoose.connection.close();
    return Promise.resolve(status);
  },
};
