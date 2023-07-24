const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const applicationVersion = await ApplicationVersionModel.findOne({
      application: req.params.applicationId,
      _id: req.params.id,
    })

    if (applicationVersion) {
      return res.status(200).json({
        data: applicationVersion.toObject(),
        status: 'success',
      })
    } else {
      return errorResponse.send(res, 'Application version not found')
    }
  } catch (e) {
    return errorResponse.send(res, 'applicationVersionGet failed', e)
  }
}
