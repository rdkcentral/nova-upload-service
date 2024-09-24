import { describe, expect, test } from 'vitest'
import supertest from 'supertest'

import { globalUser, user, unknownUser } from '../../../mocks/user'
import { app } from '../../../tests/setup'

const { email } = user

describe('POST /admin/login', () => {
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
      .send(globalUser)
      .expect(201)

    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.data.token).toBeDefined()
  })
})
