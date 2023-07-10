const ApplicationModel = require('../models/Application').model
const response = require('../lib/response')

// endpoint: GET /applications [list]
exports.listApplications = async () => {
  try {
    const data = await ApplicationModel.find(
      {
        //status: 'active'
      },
      null,
      {
        sort: { createdAt: -1 },
      }
    )
    response.json({
      data,
      status: 'success',
    })
  } catch (e) {
    console.error(e)
    response.sendError('listApplications failed', e)
  }
}

// endpoint: GET /applications/:id [get]
exports.getApplication = async (event) => {
  try {
    const result = await ApplicationModel.findOne({
      _id: event.params.id,
      // status: 'active',
    })
    if (!result) {
      return response.sendStatus(404)
    }
    response.json({
      data: result,
      status: 'success',
    })
  } catch (e) {
    console.error(e)
    response.sendError('applicationGet failed', e)
  }
}

// endpoint: POST /applications [create]
exports.createApplication = async (event) => {
  try {
    const savedresult = await ApplicationModel.create(event.body)
    response.status(201).json({
      data: savedresult.toObject(),
      status: 'success',
    })
  } catch (e) {
    response.sendError('applicationCreated failed', e)
  }
}

// endpoint: PUT /applications/:id [update]
exports.updateApplication = async (event) => {
  try {
    const result = await ApplicationModel.findOne({ _id: event.params.id })

    if (!result) {
      return response.sendStatus(404)
    }

    for (const key in event.body) {
      if (key in result && result[key] !== event.body[key] && key !== 'id') {
        result.set(key, event.body[key])
      }
    }
    result.status = 1
    await result.save()
    response.json({
      data: result.toObject(),
      status: 'success',
    })
  } catch (e) {
    console.log(e)
    response.sendError('updateApplication failed', e)
  }
}

// endpoint: DELETE /applications/:id [delete]
exports.deleteApplication = async (event) => {
  try {
    const result = await ApplicationModel.deleteOne({ _id: event.params.id })

    if (result.deletedCount > 0) {
      return response.json({
        status: 'success',
      })
    }

    return response.sendStatus(404)
  } catch (e) {
    console.error(e)
    response.sendError('applicationDelete failed', e)
  }
}
