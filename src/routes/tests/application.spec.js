import { describe, expect, test } from 'vitest'
import supertest from 'supertest'

import { application } from '../../../mocks/application'
import { app, token } from '../../../tests/setup.js'

let applicationId

describe('POST /admin/applications', () => {
  test('Create an new application', async () => {
    const response = await supertest(app)
      .post('/admin/applications')
      .set('Authorization', `Bearer ${token}`)
      .send(application)
      .expect(201)

    expect(response.body.data.identifier).toBe(application.identifier)
    expect(response.body.data.name).toBe(application.name)

    applicationId = response.body.data.id
  })
})

describe('GET /admin/applications', () => {
  test('Retrieve applications', async () => {
    const response = await supertest(app)
      .get('/admin/applications')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.data.length).toBeGreaterThan(0)
  })

  test('Retrieving applications without sending a token', async () => {
    await supertest(app).get('/admin/applications').expect(403)
  })

  test('Retrieve a single application', async () => {
    const response = await supertest(app)
      .get(`/admin/applications/${applicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.data.identifier).toBe(application.identifier)
    expect(response.body.data.name).toBe(application.name)
  })
})

describe('PUT /admin/applications/:id', () => {
  test('Update an application', async () => {
    const response = await supertest(app)
      .put(`/admin/applications/${applicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'new name' })
      .expect(200)

    expect(response.body.data.name).toBe('new name')
  })
})

describe('DELETE /admin/applications/:id', () => {
  test('Delete an application', async () => {
    await supertest(app)
      .delete(`/admin/applications/${applicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  test('Delete a non existing application', async () => {
    await supertest(app)
      .delete(`/admin/applications/doesnotexist${applicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})

describe('PATCH /admin/applications/:id', () => {
  test('Restore an application', async () => {
    await supertest(app)
      .patch(`/admin/applications/${applicationId}/restore`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  test('Restore a non existing application', async () => {
    await supertest(app)
      .patch(`/admin/applications/doesnotexist${applicationId}/restore`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})
