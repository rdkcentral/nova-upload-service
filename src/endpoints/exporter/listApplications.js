const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

const formatters = require('../../formatters')

module.exports = async (req, res) => {
  try {
    const data = await ApplicationModel.find(
      {
        status: 'active',
      },
      {
        versions: 0,
      },
      {
        sort: { name: -1 },
      }
    )

    const formatter =
      (req.query.format && formatters[req.query.format]) || formatters.default

    res.json(
      formatter.response({
        data: data.map((app) => formatter.application(app)),
        status: 'success',
      })
    )
  } catch (e) {
    errorResponse.send(res, 'applicationList failed', e)
  }
}
