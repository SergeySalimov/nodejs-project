import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from './models/user.model';
import util from 'util';
import MESSAGE from '../share/messages';
import { DB_ADDRESS, MONGOOSE_OPTIONS } from "./db.credentials";

const checkPassword = util.promisify(bcrypt.compare);

export default {
  createANewUser: async function(user) {
    const { name, surname, email, password, sid } = user;
    let result = null;
    
    if (email && password && surname && name && sid) {
      await mongoose.connect(DB_ADDRESS, MONGOOSE_OPTIONS);
      
      const user = await UserModel.findOne({ email });
  
      if (!user) {
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
      } else {
        result = MESSAGE.ERROR_FOR_USER_EXISTS;
      }
  
      mongoose.connection.close();
    } else {
      result = MESSAGE.ERROR_BAD_DATA;
    }
  
    return Promise.resolve(result);
  },
  checkUserConfirmation: async function(sid) {
    if (!sid) {
      return Promise.resolve('error');
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
  checkUserAndPassword: async function(email, password) {
    if (!email || !password) {
      return Promise.resolve({ error: 'no email or psw for check password' });
    }
    
    const result = { error: null, isMatch: false, isUserExists: false, isSIDConfirmed: false };
  
    await mongoose.connect(DB_ADDRESS, MONGOOSE_OPTIONS);
    
    const user = await UserModel.findOne({ email });
  
    if (user) {
      result.isUserExists = true;
      result.isSIDConfirmed = user.isConfirmed;
      await checkPassword(password, user.password)
        .then(isMatch => result.isMatch = isMatch)
        .catch(() => result.error = 'error on bcrypt.compare work')
      ;
    }
  
    mongoose.connection.close();
    return Promise.resolve(result);
  },
};
