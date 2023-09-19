'use strict'

const test = require('tape')
const request = require('supertest')
const { initApp, userToken, createApplication } = require('./setup')

let applicationVersion

test('POST /applications/:appId/versions - Creating an new application version', function (assert) {
  const version = '1.0.0'
  const changelog = 'Made the app 10x more awesome!!'
  initApp().then((app) => {
    userToken(app).then((token) => {
      createApplication(app).then((application) => {
        request(app)
          .post(`/applications/${application.id}/versions`)
          .set({ Authorization: `Bearer ${token}` })
          .send({
            version,
            changelog,
          })
          .expect(201)
          .then((res) => {
            assert.equal(
              res.body.data.version,
              version,
              'Should store an application version record with the correct version'
            )
            assert.equal(
              res.body.data.changelog,
              changelog,
              'Should store an application version record with the correct changelog'
            )

            assert.equal(
              res.body.data.applicationId,
              application.id,
              'Should have a reference to application'
            )

            applicationVersion = res.body.data
            assert.end()
          })
      })
    })
  })
})

// todo
test('POST /applications/:appId/versions - Creating an new application version with an existing version number', function (assert) {
  assert.end()
})

test('GET /applications/:appId/versions - Retrieve versions of an application', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      createApplication(app).then((application) => {
        request(app)
          .get(`/applications/${application.id}/versions`)
          .set({ Authorization: `Bearer ${token}` })
          .expect(200)
          .then((res) => {
            assert.true(
              Array.isArray(res.body.data),
              'Should return a data array'
            )
            assert.deepEqual(
              res.body.data[0],
              applicationVersion,
              'Should return an application version'
            )

            assert.end()
          })
      })
    })
  })
})

test('GET /applications/:appId/versions/:applicationVersionId - Retrieve details of an application-version', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      createApplication(app).then((application) => {
        request(app)
          .get(
            `/applications/${application.id}/versions/${applicationVersion.id}`
          )
          .set({ Authorization: `Bearer ${token}` })
          .expect(200)
          .then((res) => {
            assert.deepEqual(
              res.body.data,
              applicationVersion,
              'Should return the correct application version'
            )

            assert.end()
          })
      })
    })
  })
})

test('PUT /applications/:appId/versions/:applicationVersionId - Update an application-version', function (assert) {
  const updatedChangelog = 'Made the app 100x more awesome!!'
  initApp().then((app) => {
    userToken(app).then((token) => {
      createApplication(app).then((application) => {
        request(app)
          .put(
            `/applications/${application.id}/versions/${applicationVersion.id}`
          )
          .set({ Authorization: `Bearer ${token}` })
          .send({
            changelog: updatedChangelog,
          })
          .expect(200)
          .then((res) => {
            assert.equal(
              res.body.data.changelog,
              updatedChangelog,
              'Should return the updated value'
            )
            assert.end()
          })
      })
    })
  })
})

test('DELETE /applications/:appId/versions/:applicationVersionId - Delete an application-version', function (assert) {
  initApp().then((app) => {
    userToken(app).then((token) => {
      createApplication(app).then((application) => {
        request(app)
          .delete(
            `/applications/${application.id}/versions/${applicationVersion.id}`
          )
          .set({ Authorization: `Bearer ${token}` })
          .expect(200)
          .then(() => {
            request(app)
              .get(
                `/applications/${application.id}/versions/${applicationVersion.id}`
              )
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
})
