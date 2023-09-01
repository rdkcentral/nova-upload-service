const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationModel.findOne({ _id: req.params.id })

    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found',
      })
    }

    for (const key in req.body) {
      if (key in result && result[key] !== req.body[key] && key !== 'id') {
        result.set(key, req.body[key])
      }
    }
    // result.status = 1
    await result.save()
    res.json({
      data: result.toObject(),
      status: 'success',
    })
  } catch (e) {
    console.log(e)
    errorResponse.send(res, 'updateApplication failed', e)
  }
}
