const mongoose = require('../mongo')
const mongooseUniqueValidator = require('mongoose-unique-validator')
const softDelete = require('./plugins/softDelete')

const ApplicationVersionSchema = require('./ApplicationVersion').schema

// Application
const ApplicationSchema = new mongoose.Schema(
  {
    identifier: {
      $type: String,
      index: true,
      unique: true,
      required: true,
    },
    name: {
      $type: String,
      required: true,
    },
    info: {
      $type: String,
      default: null,
    },
    metadata: {
      $type: Object,
      default: null,
    },
    image: {
      $type: String,
      default: null,
    },
    status: {
      $type: String,
      enum: ['active', 'inactive'], //will be other statuses
    },
    updatedAt: {
      $type: Date,
      default: Date.now,
    },
    isHosted: {
      $type: Boolean,
      default: true,
    },
    location: {
      $type: String,
      default: null,
    },
    versions: [ApplicationVersionSchema],
    changeLog: [
      {
        $type: Object,
      },
    ],
    history: [
      {
        $type: Object,
      },
    ],
  },
  { typeKey: '$type', timestamps: true }
)

ApplicationSchema.plugin(mongooseUniqueValidator)
ApplicationSchema.plugin(softDelete)

module.exports = {
  schema: ApplicationSchema,
  model: mongoose.model('Application', ApplicationSchema),
}
