'use strict'

const test = require('tape')
const request = require('supertest')
const { initApp, userToken } = require('./setup')

console.log(userToken)

let applicationId
const name = 'My test App'
const identifier = 'my.test.app'

test('POST /applications - Creating an new application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .post('/applications')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          name,
          identifier,
        })
        .expect(201)
        .then((res) => {
          assert.equal(
            res.body.data.identifier,
            identifier,
            'Should store a record with the correct identifier'
          )
          assert.equal(
            res.body.data.name,
            name,
            'Should store a record with the correct name'
          )

          applicationId = res.body.data.id
          assert.end()
        })
    })
  })
})

// todo
// - test create app without token
// - test create app without required data

test('GET /applications - Retrieving applications', function (assert) {
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

test('GET /applications/:id - Retrieving application details', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .get(`/applications/${applicationId}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .then((res) => {
          assert.equal(
            res.body.data.identifier,
            identifier,
            'Should return the correct identifier'
          )
          assert.equal(
            res.body.data.name,
            name,
            'Should return the correct name'
          )
          assert.end()
        })
        .catch((err) => {
          assert.end(err)
        })
    })
  })
})

test('PUT /applications/:id - Editing application details', function (assert) {
  const newName = 'My awesome test App'
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .put(`/applications/${applicationId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({ name: newName })
        .expect(200)
        .then((res) => {
          assert.equal(
            res.body.data.name,
            newName,
            'Should return the correct new name'
          )
          assert.end()
        })
        .catch((err) => {
          assert.end(err)
        })
    })
  })
})

test('DELETE /applications/:id - Remove application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .delete(`/applications/${applicationId}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .then(() => {
          request(app)
            .get(`/applications/${applicationId}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(404)
            .then(() => {
              assert.end()
            })
        })
        .catch((err) => {
          assert.end(err)
        })
    })
  })
})

test('DELETE /applications/:id - Remove non-existing application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .delete('/applications/01e125710000000000000000') // object id belongs to 1970-01-01 00:00:01
        .set({ Authorization: `Bearer ${token}` })
        .expect(404)
        .then(() => {
          assert.end()
        })
        .catch((err) => {
          assert.end(err)
        })
    })
  })
})

test('PATCH /applications/:id/restore - Undo remove application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .patch(`/applications/${applicationId}/restore`)
        // note might need different permissions
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .then(() => {
          request(app)
            .get(`/applications/${applicationId}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)
            .then(() => {
              assert.end()
            })
        })
        .catch((err) => {
          assert.end(err)
        })
    })
  })
})

test('DELETE /applications/:id/restore - Try to restore non-existing application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .patch('/applications/01e125710000000000000000/restore') // object id belongs to 1970-01-01 00:00:01
        .set({ Authorization: `Bearer ${token}` })
        .expect(404)
        .then(() => {
          assert.end()
        })
        .catch((err) => {
          assert.end(err)
        })
    })
  })
})
