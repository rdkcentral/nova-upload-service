const UserModel = require('../../models/User').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    let { currentPassword, email, password} = req.body

    currentPassword = currentPassword ? currentPassword.toString(): ''
    email = email ? email.toString() : ''
    password = password ? password.toString() : ''

    const user = await UserModel.findOne({_id: req.user.id})

    if(!user){
      return res.status(404).json({
        status: 'error',
        message: 'not found'
      })
    }

    if(!currentPassword || !user.isValidPassword(currentPassword)) {
      return res.status(400).json({
        status: 'error',
        message: 'valid current password is required'
      })
    }

    if(email){
      user.email = email
    }
    if(password){
      user.password = password
    }

    await user.save()
    res.json({
      data: user.toObject(),
      status: 'success'
    })
  } catch(e){
    console.error(e)
    return errorResponse.send(res, 'userUpdateFailed', e)
  }
}
