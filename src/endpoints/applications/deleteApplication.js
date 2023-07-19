const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationModel.deleteOne({ _id: req.params.id })

    if (result.deletedCount > 0) {
      return res.json({
        status: 'success',
      })
    }

    return res.sendStatus(404)
  } catch (e) {
    console.error(e)
    errorResponse.send(res, 'applicationDelete failed', e)
  }
}
