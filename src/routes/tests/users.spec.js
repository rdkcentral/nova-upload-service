import { describe, expect, test } from 'vitest'
import supertest from 'supertest'

import { user, globalUser } from '../../../mocks/user'
import { app, token } from '../../../tests/setup'

const { email } = user
let newUserToken

describe('POST /admin/users', () => {
  test('Create a user', async () => {
    const response = await supertest(app)
      .post('/admin/users')
      .send(user)
      .expect(201)

    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.token).toBeDefined()

    newUserToken = response.body.token
  })

  test('Create a user with an existing email', async () => {
    const response = await supertest(app)
      .post('/admin/users')
      .send(user)
      .expect(400)

    expect(response.body).toHaveProperty('status', 'error')
    expect(response.body.errors).toContain('emailExists')
  })

  test('Create a user without a password', async () => {
    const response = await supertest(app)
      .post('/admin/users')
      .send({ email })
      .expect(400)

    expect(response.body).toHaveProperty('status', 'error')
    expect(response.body.errors).toContain('noPassword')
  })

  // TODO: return this when RALA is explained
  test.skip('When RALA is not signed return 451 response on login', async () => {
    const response = await supertest(app)
      .post('/admin/login')
      .send(user)
      .expect(451)

    expect(response.body).toStrictEqual({
      status: 'error',
      message: 'ralaNotSigned',
    })
  })
})

describe('GET /admin/users/validate', () => {
  test('Activate a use by validating the token', async () => {
    await supertest(app)
      .get('/admin/users/validate?token=' + newUserToken)
      .expect(200)
  })
})

describe('GET /admin/users/me', () => {
  test('Get user details for logged in user', async () => {
    const response = await supertest(app)
      .get('/admin/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.data.email).toBe(globalUser.email)
  })

  test('Get user details for logged in user without token', async () => {
    const response = await supertest(app).get('/admin/users/me').expect(403)

    expect(response.body).toHaveProperty('status', 'error')
    expect(response.body.message).toBe('No token provided')
  })
})

describe('PATCH /admin/users/me', () => {
  // TODO: think about how to reset after each run of this test collection
  test.skip('Update password for logged in user', async () => {
    await supertest(app)
      .patch('/admin/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: globalUser.password,
        password: globalUser.newPassword,
      })

    expect(true).toBe(true)
  })

  test.skip('Update email for logged in user', async () => {
    await supertest(app)
      .patch('/admin/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: globalUser.newPassword,
        email: globalUser.newEmail,
      })

    expect(true).toBe(true)
  })
})
