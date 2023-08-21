const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationVersionModel.delete({
      applicationId: req.params.applicationId,
      _id: req.params.id,
    }).catch((e) => {
      throw new Error('applicationDelete failed', { cause: e })
    })

    if (result.deleted === true) {
      return res.json({
        status: 'success',
      })
    }
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
