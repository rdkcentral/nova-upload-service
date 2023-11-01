const ApplicationModel = require('../../models/Application').model
const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.applicationId,
      userId: req.user.id,
    }).catch((e) => {
      throw new Error('application not found', { cause: e })
    })

    if (application) {
      const body = {
        version: req.body.version,
        changelog: req.body.changelog,
        appIdentifier: application.identifier,
        applicationId: application._id,
        userId: req.user.id,
        uploadStatus: 'none',
      }
      const applicationVersion = await ApplicationVersionModel.create(
        body
      ).catch((e) => {
        throw new Error('applicationVersionCreate failed', { cause: e })
      })

      return res.status(201).json({
        data: applicationVersion.toObject(),
        status: 'success',
      })
    }
    return res.status(404).json({
      status: 'error',
      message: 'Application version not found',
    })
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
