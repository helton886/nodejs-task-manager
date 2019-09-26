require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5d8c4ae07fad65d0f0ffa8e7')
//   .then(task => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then(result => {
//     console.log(result);
//   })
//   .catch(e => {
//     console.log(e);
//   });

const deleteTaskAndCount = async id => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount('5d8c4b069d0d884ce086be1a')
  .then(count => console.log(count))
  .catch(e => console.log(e));
