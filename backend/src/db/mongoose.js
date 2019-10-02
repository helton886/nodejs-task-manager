const mongoose = require('mongoose');

mongoose.connect('mongodb://db/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
