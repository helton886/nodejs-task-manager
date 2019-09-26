const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
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
});

// const test = new User({
//   name: 'Helton',
//   email: 'Teste@gmail.com',
//   password: '12357777',
// });

// test
//   .save()
//   .then(result => console.log(result))
//   .catch(error => console.log(error));

module.exports = User;
