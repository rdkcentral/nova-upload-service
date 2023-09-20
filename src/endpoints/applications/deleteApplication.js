const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationModel.delete({
      _id: req.params.id,
      userId: req.user.id,
    }).catch((e) => {
      throw new Error('applicationDelete failed', { cause: e })
    })

    // result will be undefined if the application is not found
    if (result && result.deleted === true) {
      return res.json({
        status: 'success',
      })
    }

    return res.status(404).json({
      status: 'error',
      message: 'Application not found',
    })
  } catch (e) {
    console.error(e)
    errorResponse.send(res, 'applicationDelete failed', e)
  }
}
