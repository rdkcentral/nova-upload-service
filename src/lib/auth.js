const jwt = require('jsonwebtoken')

const authorize = (event) => {
  if (event.headers.authorization) {
    const token = event.headers.authorization.split(' ').pop()
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
  } else {
    throw new Error('authorizationRequired')
  }
}

module.exports = {
  authorize,
}
