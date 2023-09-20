const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const applicationVersion = await ApplicationVersionModel.findOne({
      applicationId: req.params.applicationId,
      _id: req.params.id,
      userId: req.user.id,
    }).catch((e) => {
      throw new Error('applicationVersionUpdate failed', { cause: e })
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

      await applicationVersion.save().catch((e) => {
        throw new Error('applicationVersionUpdate failed', { cause: e })
      })

      return res.status(200).json({
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
