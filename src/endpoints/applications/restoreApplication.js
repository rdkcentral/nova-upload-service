const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationModel.restore({
      _id: req.params.id,
    }).catch((e) => {
      throw new Error('applicationRestore failed', { cause: e })
    })

    // result can be undefined if the application is not found
    if (result && result.deleted === false) {
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
