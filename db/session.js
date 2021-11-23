import { DB_ADDRESS, MONGOOSE_OPTIONS } from './db.credentials';
import mongoose from 'mongoose';
import UserModel from './models/user.model';
import SessionModel from './models/session.model'
import { getRandomString, addHours } from '../share/helper-es6';

async function closeAllInactiveSession() {
  const dateNow = new Date();
  await SessionModel.deleteMany({ 'keepAliveTo': { $lt: dateNow } });
}

export default {
  createUpdateSession: async function (email) {
    if (!email) {
      return Promise.resolve({ error: 'No email' });
    }
    
    const result = { xToken: null, error: null };
    
    await mongoose.connect(DB_ADDRESS, MONGOOSE_OPTIONS);
    await closeAllInactiveSession();
    
    const user = await UserModel.findOne({ email });
    
    if (user) {
      const session = await SessionModel.findOne({ userId: user._id.toString() });
  
      if (!session) {
        const xToken = getRandomString(100);
    
        const newSession = new SessionModel({
          xToken,
          userId: user._id.toString(),
          startDate: new Date(),
          keepAliveTo: addHours(2),
        });
        
        await newSession.save();
        
        result.xToken = xToken;
      } else {
        result.xToken = session.xToken;
      }
    } else {
      result.error = 'no user found';
    }
    
    mongoose.connection.close();
    return Promise.resolve(result);
  },
  getXToken: async function (email) {
    if (!email) {
      return Promise.resolve({ error: 'No email' });
    }
  
    const result = { xToken: null, error: null };
  
    await mongoose.connect(DB_ADDRESS, MONGOOSE_OPTIONS);
    await closeAllInactiveSession();
    
    const user = await UserModel.findOne({ email });
  
    if (user) {
      const session = await SessionModel.findOne({ userId: user._id.toString() });
  
      result.xToken = session ? session.xToken : null;
    } else {
      result.error = 'no user found';
    }
    
    mongoose.connection.close();
    return Promise.resolve(result);
  },
};
