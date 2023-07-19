const jwt = require('jsonwebtoken')

// any endpoint requires authentication/login must use this middleware to check
// this will be replaced as we progress because we will need different permissions of each user type
const authRequired = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ').pop()
    let isAuthenticated = false
    let currentUser

    try {
      currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
      isAuthenticated = true
    } catch (error) {
      res.sendStatus(403)
    }

    if (isAuthenticated) {
      req.user = currentUser
      next()
    }
  } else {
    res.sendStatus(403)
  }
}

module.exports = {
  authRequired,
}
