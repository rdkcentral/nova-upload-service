const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationVersionModel.restore({
      applicationId: req.params.applicationId,
      _id: req.params.id,
    }).catch((e) => {
      throw new Error('applicationVersionRestore failed', { cause: e })
    })

    // result can be undefined if the application is not found
    if (result && result.deleted === false) {
      return res.json({
        status: 'success',
      })
    }

    return res.status(404).json({
      status: 'error',
      message: 'Application version not found',
    })
  } catch (e) {
    console.error(e)
    errorResponse.send(res, 'applicationVersionRestore failed', e)
  }
}
