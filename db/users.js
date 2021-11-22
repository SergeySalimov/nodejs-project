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
        createdAt: new Date().toUTCString(),
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
  }
};
