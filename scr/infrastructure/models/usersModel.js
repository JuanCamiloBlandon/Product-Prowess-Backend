const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = Schema({

  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },

  bio: {
    type: String,
    require: true
  },

  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    require: true
  },

  updatedAt: {
    type: Date,
    require: true
  },
  
});

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

UserSchema.methods.comparePassword = async (passwordBody, password) => {
  return bcrypt.compare(passwordBody, password);
};

module.exports = model('User', UserSchema);