const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

const formatters = require('../../formatters')

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.id,
      status: 'active',
    })
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found',
      })
    }

    const formatter =
      (req.query.format && formatters[req.query.format]) || formatters.default

    res.json(
      formatter.response({
        data: formatter.application(application),
        status: 'success',
      })
    )
  } catch (e) {
    errorResponse.send(res, 'applicationGet failed', e)
  }
}
