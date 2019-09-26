const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// const test = new Task({
//   description: 'Try harder!',
// });

// test
//   .save()
//   .then(result => console.log(result))
//   .catch(error => console.log(error));

module.exports = Task;
