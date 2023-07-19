const UserModel = require('../../models/User').model

module.exports = async (req, res) => {
  let { email, password } = req.body

  email = email ? email.toString() : ''
  password = password ? password.toString() : ''

  const user = await UserModel.findOne({ email })

  if (user && user.isValidPassword(password)) {
    try {
      // update lastlogin
      await UserModel.updateOne({ email }, { lastLoginAt: new Date() })
    } catch (err) {
      return res.sendStatus(500)
    }
    return res.status(201).json({
      data: user.toObjectWithToken(),
      status: 'success',
    })
  }

  return res.status(401).json({
    status: 'error',
    message: 'invalidUserCredentials',
  })
}
