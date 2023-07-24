const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationVersionModel.deleteOne({
      application: req.params.applicationId,
      _id: req.params.id,
    })

    if (result.deletedCount > 0) {
      return res.json({
        status: 'success',
      })
    } else {
      return res.sendStatus(404)
    }
  } catch (e) {
    return errorResponse.send(res, 'applicationVersionDelete failed', e)
  }
}
