const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationVersionModel.delete({
      applicationId: req.params.applicationId,
      _id: req.params.id,
    }).catch((e) => {
      throw new Error('applicationVersionDelete failed', { cause: e })
    })

    // result can be undefined if the applicationVersion is not found
    if (result && result.deleted === true) {
      return res.json({
        status: 'success',
      })
    }
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
