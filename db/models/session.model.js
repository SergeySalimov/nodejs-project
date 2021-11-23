import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: String,
  xToken: String,
  startDate: Date,
  keepAliveTo: Date,
});

export default mongoose.model('Session', SessionSchema);
