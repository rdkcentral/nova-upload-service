const UserModel = require('../../models/User').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const savedUser = await UserModel.create(req.body)
    res.status(201).json({
      data: savedUser.toObjectWithToken(),
      status: 'success'
    })
  } catch (e) {
    errorResponse.send(res, 'userCreationFailed', e)
  }
}
