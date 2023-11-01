const errorResponse = require('../../helpers/errorResponse')
const ApplicationVersionModel = require('../../models/ApplicationVersion').model

module.exports = async (req, res) => {
  try {
    let data = await ApplicationVersionModel.find({
      applicationId: req.params.applicationId,
      userId: req.user.id,
    })
      .populate('versions') //needed to get fresh data
      .catch((e) => {
        throw new Error('applicationVersionList failed', { cause: e })
      })

    return res.status(200).json({
      data: data || [],
      status: 'success',
    })
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
