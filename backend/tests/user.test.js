const request = require('supertest');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');
const app = require('../src/app');
const User = require('../src/models/user');

beforeEach(setupDatabase);

test('should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Helton',
      email: 'heltonvasconcelos@test.com',
      password: 'Testpass12!',
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assert about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Helton',
      email: 'heltonvasconcelos@test.com',
    },
    token: user.tokens[0].token,
  });
  // Assert that the user password was hashed
  expect(user.password).not.toBe('Testpass12!');
});

test('should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  // Assert the token was stored
  const user = await User.findById(userOneId);
  expect(user.tokens[1].token).toBe(response.body.token);
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

test('Should get user profile', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get user profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete user account', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  // Assert user was deleted
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test('Should not delete user account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  // Assert that the avatar was uploaded
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ Location: 'Recife' })
    .expect(400);
});
