const mongoose = require('../mongo')
const mongooseUniqueValidator = require('mongoose-unique-validator')

// ApplicationVersion
const ApplicationVersionSchema = new mongoose.Schema(
  {
    version: {
      $type: String,
      index: true,
      // unique: true, // todo
      required: true,
    },
    appIdentifier: {
      $type: String,
      index: true,
      required: true,
    },
    application: {
      $type: mongoose.ObjectId,
      ref: 'Application',
      // index: true // ??
      required: true,
    },
    changelog: {
      $type: String,
      required: true,
    },
    updatedAt: {
      $type: Date,
      default: Date.now,
    },
  },
  { typeKey: '$type', timestamps: true }
)

ApplicationVersionSchema.plugin(mongooseUniqueValidator)

module.exports = {
  schema: ApplicationVersionSchema,
  model: mongoose.model('ApplicationVersion', ApplicationVersionSchema),
}
