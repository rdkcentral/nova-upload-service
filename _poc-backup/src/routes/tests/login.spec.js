/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2024 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
