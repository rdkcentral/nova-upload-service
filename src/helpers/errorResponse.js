// fixme: this must be improved by checking different Mongoose error types
function send(res, message, error) {
  if (process.env.DEBUG_LOGGING === 'true') {
    console.log('====================================')
    console.log('Error response')
    console.log('====================================')
    console.log(message)
    console.log(error)
    console.log('------------------------------------')
  }

  const errorResponse = {
    status: 'error',
    message: message,
    errors: [],
  }

  if (error) {
    if (error.name && error.name == 'ValidationError') {
      for (const [key, value] of Object.entries(error.errors)) {
        if (value.kind == 'user defined' || value.kind == 'required') {
          errorResponse.errors.push(value.message)
        } else {
          const errorCode = value.kind == 'unique' ? 'Exists' : 'Invalid'
          errorResponse.errors.push(`${key}${errorCode}`)
        }
      }
    }
    if (error.name && error.name == 'Error') {
      errorResponse.errors.push(error.message)
    }
    return res.status(400).json(errorResponse)
  }

  // otherwise it must be server error
  res.sendStatus(500).json(errorResponse)
}

module.exports = {
  send,
}
