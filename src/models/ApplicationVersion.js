const mongoose = require('../mongo')
const mongooseUniqueValidator = require('mongoose-unique-validator')
const softDelete = require('./plugins/softDelete')

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
    applicationId: {
      $type: mongoose.ObjectId,
      ref: 'Application',
      // index: true // ??
      required: true,
    },
    uploadStatus: {
      $type: String,
      enum: ['pending', 'ready', 'error'],
      default: '',
    },
    versionPath: {
      $type: String,
      default: '',
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
ApplicationVersionSchema.plugin(softDelete)

module.exports = {
  schema: ApplicationVersionSchema,
  model: mongoose.model('ApplicationVersion', ApplicationVersionSchema),
}
