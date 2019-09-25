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

const test = new User({ name: 'Helton', age: 23 });

test
  .save()
  .then(result => console.log(result))
  .catch(error => console.log(error));
