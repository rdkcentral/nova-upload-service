const UserModel = require('../../models/User').model

module.exports = async (req, res) => {
  try {
    let user = await UserModel.findOne({_id: req.user.id})
    if(!user){
      return res.status(404).json({ // could be 403
        status: 'error',
        message: 'not found'
      })
    }

    res.status(200).json({
      data: user.toObject(),
      status: 'success'
    })
  } catch(e){
    console.error(e)
    res.status(500).json({
      status: 'error',
      message: 'user could not be retrieved'
    })
  }
}
