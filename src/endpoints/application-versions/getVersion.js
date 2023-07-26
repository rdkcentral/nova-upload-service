const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const applicationVersion = await ApplicationVersionModel.findOne({
      applicationId: req.params.applicationId,
      _id: req.params.id,
    }).catch((e) => {
      throw new Error('applicationVersionGet failed', { cause: e })
    })

    if (applicationVersion) {
      return res.status(200).json({
        data: applicationVersion.toObject(),
        status: 'success',
      })
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
