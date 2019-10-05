const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const { userOne, userTwo, setupDatabase, taskOne } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 'Testing tasks' })
    .expect(201);
  // Assert that the task was created
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should fetch user tasks', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  // Assert that the user has 2 tasks
  expect(response.body.length).toEqual(2);
});

test('Should not delete task from userOne', async () => {
  request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(500);

  // Assert that the task is still there
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
