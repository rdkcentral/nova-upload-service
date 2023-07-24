const errorResponse = require('../../helpers/errorResponse')
const ApplicationModel = require('../../models/Application').model

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.applicationId,
    })

    if (application) {
      res.status(200).json({
        data: application.versions.toObject(),
        status: 'success',
      })
    }
  } catch (e) {
    errorResponse.send(res, 'applicationGet failed', e)
  }
}
