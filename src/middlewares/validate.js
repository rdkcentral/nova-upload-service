const mongoose = require('mongoose')

// any endpoint requires path/:id must use this middleware to check
const validateId = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    next()
  } else {
    res.status(400).json({
      status: 'error',
      message: 'invalid id',
    })
  }
}

module.exports = {
  validateId,
}
