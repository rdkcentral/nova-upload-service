import { beforeAll, describe, afterAll, expect, test } from 'vitest'
import supertest from 'supertest'

import { user, unknownUser } from '../mocks/user'
import { initApp } from './setup'

let app, token
const { email } = user

describe('User admin', () => {
  beforeAll(async () => {
    app = await initApp()
  })

  test('Create a user', async () => {
    const response = await supertest(app)
      .post('/admin/users')
      .send(user)
      .expect(201)

    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.token).toBeDefined()

    token = response.body.token
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

  test('Activate a use by validating the token', async () => {
    await supertest(app)
      .get('/admin/users/validate?token=' + token)
      .expect(200)
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

  test('Login as an unknown user', async () => {
    const response = await supertest(app)
      .post('/admin/login')
      .send(unknownUser)
      .expect(401)

    expect(response.body).toStrictEqual({
      status: 'error',
      message: 'invalidUserCredentials',
    })
  })

  test('Login with a wrong password', async () => {
    const response = await supertest(app)
      .post('/admin/login')
      .send({ email, password: 'wrong!!!' })
      .expect(401)

    expect(response.body).toStrictEqual({
      status: 'error',
      message: 'invalidUserCredentials',
    })
  })

  test('Login without email or password', async () => {
    const response = await supertest(app).post('/admin/login').expect(401)

    expect(response.body).toStrictEqual({
      status: 'error',
      message: 'invalidUserCredentials',
    })
  })

  test('Login as a user', async () => {
    const response = await supertest(app)
      .post('/admin/login')
      .send(user)
      .expect(201)

    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.data.token).toBeDefined()

    token = response.body.data.token
  })

  test('Get user details for logged in user', async () => {
    const response = await supertest(app)
      .get('/admin/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.data.email).toBe(user.email)
  })

  test('Get user details for logged in user without token', async () => {
    const response = await supertest(app).get('/admin/users/me').expect(403)

    expect(response.body).toHaveProperty('status', 'error')
    expect(response.body.message).toBe('No token provided')
  })

  afterAll(() => {
    app = null
  })
})
