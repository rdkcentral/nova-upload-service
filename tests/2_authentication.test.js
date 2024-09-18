/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const test = require('tape')
const request = require('supertest')
const { initApp } = require('./setup')

// Email and password variables contain dummy values, used
// only for running local tests. They are not associated with any real
// user account or real access
const email = 'test@foo.com'
const newEmail = 'newtest@foo.com'
const password = 'Hello1213'
const newPassword = 'Welcome123'
const invalidPassword = 'W'

let token

test('POST /admin/users - Creating a user', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/admin/users')
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
          'tokenExpiresAt',
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

test('POST /admin/users - Creating a user with an existing email', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/admin/users')
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

test('POST /admin/users - Creating a user without a password', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/admin/users')
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

test('POST /admin/login - Login as a user', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/admin/login')
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
          'tokenExpiresAt',
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

test('POST /admin/login - Login with an email that does not exist', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/admin/login')
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

test('POST /admin/login - Login with a wrong password', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/admin/login')
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

test('POST /admin/login - Login without email or password', function (assert) {
  initApp().then((app) => {
    request(app)
      .post('/admin/login')
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

test('GET /admin/users/me - Get user details for logged in user', function (assert) {
  initApp().then((app) => {
    request(app)
      .get('/admin/users/me')
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

test('GET /admin/users/me - Get user details for logged in user without passing a token', function (assert) {
  initApp().then((app) => {
    request(app)
      .get('/admin/users/me')
      .expect(403)
      .then(() => {
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('PATCH /admin/users/me - Update password for logged in user', function (assert) {
  initApp().then((app) => {
    request(app)
      .patch('/admin/users/me')
      .set({ Authorization: `Bearer ${token}` })
      .send({ currentPassword: password, password: newPassword })
      .expect(200)
      .then(() => {
        request(app)
          .post('/admin/login')
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

test('PATCH /admin/users/me - Update password with an invalid password for logged in user', function (assert) {
  initApp().then((app) => {
    request(app)
      .patch('/admin/users/me')
      .set({ Authorization: `Bearer ${token}` })
      .send({ currentPassword: password, password: invalidPassword })
      .expect(400)
      .then(() => {
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('PATCH /admin/users/me - Update email for logged in user', function (assert) {
  initApp().then((app) => {
    request(app)
      .patch('/admin/users/me')
      .set({ Authorization: `Bearer ${token}` })
      .send({ currentPassword: newPassword, email: newEmail })
      .expect(200)
      .then(() => {
        request(app)
          .post('/admin/login')
          .send({ email: newEmail, password: newPassword })
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

// TODO: create test for GET /admin/users/validate endpoint, with and without a callbackUrl
