const errorResponse = require('../../helpers/errorResponse')
const ApplicationModel = require('../../models/Application').model

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.applicationId,
    }).catch((e) => {
      throw new Error('applicationVersionGet failed', { cause: e })
    })

    if (application) {
      res.status(200).json({
        data: application.versions.toObject(),
        status: 'success',
      })
    }
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
