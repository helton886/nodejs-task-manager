const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manage-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model('User', {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const Task = mongoose.model('Task', {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});

const test = new Task({
  description: 'Have to study nodejs',
  completed: false,
});

test
  .save()
  .then(result => console.log(result))
  .catch(error => console.log(error));
