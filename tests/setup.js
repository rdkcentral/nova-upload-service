const { MongoMemoryServer } = require('mongodb-memory-server')

const setup = async function () {
  return MongoMemoryServer.create().then(async (mongoServer) => {
    process.env.MONGODB_URL = mongoServer.getUri()
    const mod = await import('../src/app.js')
    return mod.default
  })
}

module.exports = setup
