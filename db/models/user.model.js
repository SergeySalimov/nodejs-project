import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

// установка схемы
const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  photoUrl: String,
  createdAt: Date,
  isConfirmed: Boolean,
  isDeleted: Boolean,
  isAdmin: Boolean,
  sid: String
});

UserSchema.pre('save', function (next) {
  const user = this;

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(saltRounds, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function(hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

export default mongoose.model('User', UserSchema);
