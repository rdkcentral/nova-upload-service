const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationModel.findOne({
      _id: req.params.id,
      status: 'active',
    })
    if (!result) {
      return res.sendStatus(404)
    }
    res.json({
      data: result,
      status: 'success',
    })
  } catch (e) {
    console.error(e)
    errorResponse.send(res, 'applicationGet failed', e)
  }
}
