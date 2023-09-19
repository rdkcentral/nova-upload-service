const ApplicationModel = require('../../models/Application').model
const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.applicationId,
    }).catch((e) => {
      throw new Error('application not found', { cause: e })
    })

    if (application) {
      const body = {
        version: req.body.version,
        changeLog: req.body.changeLog,
        appIdentifier: application.identifier,
        applicationId: application._id,
      }
      const applicationVersion = await ApplicationVersionModel.create(
        body
      ).catch((e) => {
        throw new Error('applicationVersionCreate failed', { cause: e })
      })

      application.versions.push(applicationVersion)
      await application.save().catch((e) => {
        throw new Error('applicationUpdate failed', { cause: e })
      })

      res.status(201).json({
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
