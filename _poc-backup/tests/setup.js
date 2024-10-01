/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the License);
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

import { beforeAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import supertest from 'supertest'

import { globalUser } from '../mocks/user.js'

export let app, token

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URL = mongoServer.getUri()

  const mod = await import('../src/app.js')
  app = mod.default

  const response = await supertest(app).post('/admin/users').send(globalUser)

  await supertest(app).get('/admin/users/validate?token=' + response.body.token)

  const result = await supertest(app).post('/admin/login').send(globalUser)

  token = result.body.data.token
})
