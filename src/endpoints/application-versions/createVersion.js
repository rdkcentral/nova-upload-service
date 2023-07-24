const ApplicationModel = require('../../models/Application').model
const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.applicationId,
    })

    if (application) {
      try {
        const body = {
          version: req.body.version,
          changelog: req.body.changelog,
          appIdentifier: application.identifier,
          applicationId: application.id,
        }
        const applicationVersion = await ApplicationVersionModel.create(body)

        application.versions.push(applicationVersion)
        await application.save()

        res.status(200).json({
          data: applicationVersion.toObject(),
          status: 'success',
        })
      } catch (e) {
        errorResponse.send(res, 'applicationVersionCreate failed', e)
      }
    } else {
      errorResponse.send(res, 'application not found')
    }
  } catch (e) {
    errorResponse.send(res, 'applicationGet failed', e)
  }
}
