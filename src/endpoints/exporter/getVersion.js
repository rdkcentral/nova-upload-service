const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

const formatters = require('../../formatters')

module.exports = async (req, res) => {
  try {
    const applicationVersion = await ApplicationVersionModel.findOne({
      applicationId: req.params.applicationId,
      _id: req.params.id,
      status: 'inactive',
    }).catch((e) => {
      throw new Error('applicationVersionGet failed', { cause: e })
    })

    if (applicationVersion) {
      const formatter =
        (req.query.format && formatters[req.query.format]) || formatters.default

      return res.status(200).json(
        formatter.response({
          data: formatter.applicationVersion(applicationVersion),
          status: 'success',
        })
      )
    }

    return res.status(404).json({
      status: 'error',
      message: 'Application version not found',
    })
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
