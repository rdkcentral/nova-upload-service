const UserModel = require('../models/User').model
const response = require('../lib/response')

// endpoint: POST /users [create user]
exports.createUser = async (event) => {
  try {
    const savedUser = await UserModel.create(event.body)
    return response.status(201, {
      data: savedUser.toObjectWithToken(),
      status: 'success',
    })
  } catch (e) {
    console.log(e)
    return response.sendError('userCreationFailed', e)
  }
}

// endpoint: GET /users/me [get user]
exports.getUserInfo = async (event) => {
  try {
    const user = await UserModel.findOne({ _id: event.user.id })

    if (!user) {
      return response.sendStatus(404)
    }

    response.status(200, {
      data: user.toObject(),
      status: 'success',
    })
  } catch (e) {
    console.error(e)
    response.sendStatus(500)
  }
}

// endpoint: PUT /users/me [update user info]
exports.updateUserInfo = async (event) => {
  try {
    let { currentPassword, email, password } = event.body

    currentPassword = currentPassword ? currentPassword.toString() : ''
    email = email ? email.toString() : ''
    password = password ? password.toString() : ''

    const user = await UserModel.findOne({ _id: event.user.id })

    if (!user) {
      return response.sendStatus(404)
    }

    if (!currentPassword || !user.isValidPassword(currentPassword)) {
      return response.status(400, {
        status: 'error',
        message: 'valid current password is required',
      })
    }

    if (email) {
      user.email = email
    }

    if (password) {
      user.password = password
    }

    await user.save()
    response.status(200, {
      data: user.toObject(),
      status: 'success',
    })
  } catch (e) {
    console.error(e)
    return response.sendError('userUpdateFailed', e)
  }
}

// POST /login [login user]
exports.loginUser = async (event) => {
  let { email, password } = JSON.parse(event.body)
  email = email ? email.toString() : ''
  password = password ? password.toString() : ''

  const user = await UserModel.findOne({ email })
  if (user && user.isValidPassword(password)) {
    try {
      // update lastlogin
      await UserModel.updateOne({ email }, { lastLoginAt: new Date() })
    } catch (err) {
      return response.sendStatus(500)
    }
    return response.status(200, {
      data: user.toObjectWithToken(),
      status: 'success',
    })
  }

  return response.status(401, {
    status: 'error',
    message: 'invalidUserCredentials',
  })
}
