const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const savedresult = await ApplicationModel.create(req.body)
    res.status(201).json({
      data: savedresult.toObject(),
      status: 'success',
    })
  } catch (e) {
    errorResponse.send(res, 'applicationCreated failed', e)
  }
}
