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
    .post('/users')
    .send({ email: 'test@test.com', password: 'Password1234' })
    .then((res) => {
      token = res.body.data.token
      return token
    })
}

module.exports = {
  initApp,
  userToken,
}
