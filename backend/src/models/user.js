const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be a positive number!');
        }
      },
    },
    email: {
      type: String,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!');
        }
      },
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      required: true,
      validate(value) {
        if (value.includes('password')) {
          throw new Error('Password can not contains "password"');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

// creating virtual ref to tasks
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'creator',
});

// genarate and store the jwt to the user
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// hidding password and session tokens
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

// find the user by email, then check if the password matches the hashed one on mongodb
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('Unable to login!');

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error('Unable to login!');

  return user;
};

// hash the password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({ creator: user._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
