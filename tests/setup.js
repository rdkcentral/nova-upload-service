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
    .send({ name: 'My App', identifier: 'app.identifier' })
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
