const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const data = await ApplicationModel.find(
      {
        //status: 'active'
        userId: req.user.id,
      },
      {
        versions: 0,
      },
      {
        sort: { createdAt: -1 },
      }
    )
    res.json({
      data,
      status: 'success',
    })
  } catch (e) {
    errorResponse.send(res, 'applicationList failed', e)
  }
}
