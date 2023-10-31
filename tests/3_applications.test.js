'use strict'

const test = require('tape')
const request = require('supertest')
const { initApp, userToken } = require('./setup')

let applicationId
const name = 'My test App'
const identifier = 'myTestApp'

test('POST /admin/applications - Creating an new application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .post('/admin/applications')
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

test('GET /admin/applications - Retrieving applications', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .get('/admin/applications')
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

test('GET /admin/applications - Retrieving applications without sending a token', function (assert) {
  initApp().then((app) => {
    request(app)
      .get('/admin/applications')
      .expect(403)
      .then(() => {
        assert.end()
      })
      .catch((err) => {
        assert.end(err)
      })
  })
})

test('GET /admin/applications/:id - Retrieving application details', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .get(`/admin/applications/${applicationId}`)
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

test('PUT /admin/applications/:id - Editing application details', function (assert) {
  const newName = 'My awesome test App'
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .put(`/admin/applications/${applicationId}`)
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

test('DELETE /admin/applications/:id - Remove application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .delete(`/admin/applications/${applicationId}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .then(() => {
          request(app)
            .get(`/admin/applications/${applicationId}`)
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

test('DELETE /admin/applications/:id - Remove non-existing application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .delete('/admin/applications/01e125710000000000000000') // object id belongs to 1970-01-01 00:00:01
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

test('PATCH /admin/applications/:id/restore - Undo remove application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      request(app)
        .patch(`/admin/applications/${applicationId}/restore`)
        // note might need different permissions
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .then(() => {
          request(app)
            .get(`/admin/applications/${applicationId}`)
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

test('DELETE /admin/applications/:id/restore - Try to restore non-existing application', function (assert) {
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
