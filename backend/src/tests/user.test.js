const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

const userOne = {
  name: 'Mars',
  email: 'mars@test.gmail.com',
  password: 'testE12@',
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('should signup a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Helton',
      email: 'heltonvasconcelos@test.com',
      password: 'Testpass12!',
    })
    .expect(201);
});

test('should login existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test('should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'helton@teste.com',
      password: '123456712',
    })
    .expect(400);
});
