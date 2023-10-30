const errorResponse = require('../../helpers/errorResponse')
const ApplicationModel = require('../../models/Application').model

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.applicationId,
      userId: req.user.id,
    })
      .populate('versions') //needed to get fresh data
      .catch((e) => {
        throw new Error('applicationVersionList failed', { cause: e })
      })

    if (application) {
      return res.status(200).json({
        data: application.versions.toObject(),
        status: 'success',
      })
    }

    return res.status(404).json({
      status: 'error',
      message: 'Application not found',
    })
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
