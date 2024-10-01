/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
      index: true,
      required: true,
    },
    userId: {
      $type: mongoose.ObjectId,
      index: true,
    },
    status: {
      $type: String,
      enum: ['active', 'inactive'], //will be decided later
      default: 'inactive',
    },
    uploadStatus: {
      $type: String,
      enum: ['none', 'pending', 'ready', 'error'],
      default: 'none',
    },
    versionPath: {
      $type: String,
      default: '',
    },
    changelog: {
      $type: String,
      required: true,
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
