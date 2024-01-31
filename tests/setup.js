/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast
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

const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')

let app

const initApp = async function () {
  if (app) return app
  return MongoMemoryServer.create().then(async (mongoServer) => {
    process.env.MONGODB_URL = mongoServer.getUri()
    const mod = await import('../src/app.js')
    app = mod.default
    return app
  })
}

let token

const userToken = async function (app) {
  if (token) return token
  return request(app)
    .post('/admin/users')
    .send({ email: 'test@test.com', password: 'Password1234' })
    .then((res) => {
      token = res.body.data.token
      return token
    })
}

let application

const createApplication = async function (app) {
  if (application) return application
  return request(app)
    .post('/admin/applications')
    .send({ name: 'My App', identifier: 'appidentifier' })
    .set({ Authorization: `Bearer ${token}` })
    .then((res) => {
      application = res.body.data
      return application
    })
}

module.exports = {
  initApp,
  userToken,
  createApplication,
}
