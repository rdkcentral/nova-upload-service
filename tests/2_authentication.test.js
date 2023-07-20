'use strict'

const test = require('tape')
const request = require('supertest')
const setup = require('./setup')

test('POST /users - Creating a user', function (assert) {
  const email = 'test@foo.com'
  setup().then((app) => {
    request(app)
      .post('/users')
      .send({ email: email, password: 'Hello1213' })
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
  setup().then((app) => {
    request(app)
      .post('/users')
      .send({ email: 'test@foo.com', password: 'Hello1213' })
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
  setup().then((app) => {
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
