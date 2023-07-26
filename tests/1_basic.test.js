'use strict'

const test = require('tape')
const request = require('supertest')
const { initApp } = require('./setup')

test('GET /404 - 404', function (assert) {
  initApp().then((app) => {
    request(app)
      .get('/')
      .expect(404)
      .then((res) => {
        const expected = {
          message: 'Not Found',
        }

        assert.same(res.body, expected, 'Should return a Not Found message')
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})
