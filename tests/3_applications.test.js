'use strict'

const test = require('tape')
const request = require('supertest')
const { initApp, userToken } = require('./setup')

test('GET /applications - Retrieving applications', async function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .get('/applications')
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .then((res) => {
          assert.true(
            Array.isArray(res.body.data),
            'Should return a data array'
          )
          assert.end()
        })
        .catch((err) => {
          assert.end(err)
        })
    })
  })
})

test('GET /applications - Retrieving applications without sending a token', function (assert) {
  initApp().then((app) => {
    request(app)
      .get('/applications')
      .expect(403)
      .then(() => {
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})
