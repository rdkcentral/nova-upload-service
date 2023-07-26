'use strict'

const test = require('tape')
const request = require('supertest')
const { initApp } = require('./setup')

const email = 'test@foo.com'
const password = 'Hello1213'
let token

test('POST /users - Creating a user', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(201)
      .then((res) => {
        const expectedDataKeys = [
          'email',
          'type',
          'status',
          'lastLoginAt',
          'createdAt',
          'updatedAt',
          'id',
          'token',
          'tokenExpiredAt',
        ]

        assert.same(
          Object.keys(res.body.data),
          expectedDataKeys,
          'Should return an object with the specified keys'
        )

        assert.equal(
          res.body.data.type,
          'dev',
          'Should have the type `dev` by default'
        )
        assert.equal(
          res.body.data.email,
          email,
          'Should return the supplied email address'
        )
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('POST /users - Creating a user with an existing email', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .then((res) => {
        const expected = {
          status: 'error',
          message: 'userCreationFailed',
          errors: ['emailExists'],
        }

        assert.same(
          res.body,
          expected,
          'Should return a user creation failed error message, with emailExists error'
        )
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('POST /users - Creating a user without a password', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/users')
      .send({ email: 'test2@foo.com' })
      .expect(400)
      .then((res) => {
        const expected = {
          status: 'error',
          message: 'userCreationFailed',
          errors: ['Path `password` is required.'],
        }

        assert.same(
          res.body,
          expected,
          'Should return a user creation failed error message, with password required error'
        )
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('POST /login - Login as a user', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/login')
      .send({ email, password })
      .expect(201)
      .then((res) => {
        const expectedDataKeys = [
          'email',
          'type',
          'status',
          'lastLoginAt',
          'createdAt',
          'updatedAt',
          'id',
          'token',
          'tokenExpiredAt',
        ]

        assert.same(
          Object.keys(res.body.data),
          expectedDataKeys,
          'Should return an object with the specified keys'
        )

        assert.equal(
          res.body.data.email,
          email,
          'Should return the supplied email address'
        )

        token = res.body.data.token
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('POST /login - Login with an email that does not exist', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/login')
      .send({ email: 'bla@bla.bla', password })
      .expect(401)
      .then((res) => {
        const expected = { status: 'error', message: 'invalidUserCredentials' }

        assert.same(
          res.body,
          expected,
          'Should return a login failed error message, with invalidUserCredentials error'
        )

        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('POST /login - Login with a wrong password', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/login')
      .send({ email, password: 'wrong!!!' })
      .expect(401)
      .then((res) => {
        const expected = { status: 'error', message: 'invalidUserCredentials' }

        assert.same(
          res.body,
          expected,
          'Should return a login failed error message, with invalidUserCredentials error'
        )

        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('POST /login - Login without email or password', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/login')
      .expect(401)
      .then((res) => {
        const expected = { status: 'error', message: 'invalidUserCredentials' }

        assert.same(
          res.body,
          expected,
          'Should return a login failed error message, with invalidUserCredentials error'
        )

        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('GET /users/me - Get user details for logged in user', function (assert) {
  initApp().then((app) => {
    request(app)
      .get('/users/me')
      .set({ Authorization: `Bearer ${token}` })
      .expect(200)
      .then((res) => {
        const expectedDataKeys = [
          'email',
          'type',
          'status',
          'lastLoginAt',
          'createdAt',
          'updatedAt',
          'id',
        ]

        assert.same(
          Object.keys(res.body.data),
          expectedDataKeys,
          'Should return an object with the specified keys'
        )

        assert.same(
          res.body.data.email,
          email,
          'Should return the email matching the token'
        )

        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('GET /users/me - Get user details for logged in user without passing a token', function (assert) {
  initApp().then((app) => {
    request(app)
      .get('/users/me')
      .expect(403)
      .then(() => {
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('PUT /users/me - Update password for logged in user', function (assert) {
  const newPassword = 'Welcome123'
  initApp().then((app) => {
    request(app)
      .patch('/users/me')
      .set({ Authorization: `Bearer ${token}` })
      .send({ currentPassword: password, password: newPassword })
      .expect(200)
      .then(() => {
        request(app)
          .post('/login')
          .send({ email, password: newPassword })
          .expect(201)
          .then(() => {
            assert.end()
          })
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})
