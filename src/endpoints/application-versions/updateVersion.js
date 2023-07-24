const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const applicationVersion = await ApplicationVersionModel.findOne({
      application: req.params.applicationId,
      _id: req.params.id,
    })

    if (applicationVersion) {
      for (const key in req.body) {
        if (
          key !== 'id' &&
          key in applicationVersion &&
          applicationVersion[key] !== req.body[key]
        ) {
          applicationVersion.set(key, req.body[key])
        }
      }
      return res.status(200).json({
        data: applicationVersion.toObject(),
        status: 'success',
      })
    } else {
      return errorResponse.send(res, 'Application version not found')
    }
  } catch (e) {
    return errorResponse.send(res, 'applicationVersionUpdate failed', e)
  }
}
