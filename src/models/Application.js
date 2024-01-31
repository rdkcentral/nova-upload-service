/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast
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
const ShortUniqueId = require('short-unique-id')

// Application
const ApplicationSchema = new mongoose.Schema(
  {
    identifier: {
      $type: String,
      index: true,
      unique: true,
      required: true,
    },
    userId: {
      $type: mongoose.ObjectId,
      index: true,
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
      default: 'inactive',
    },
    isHosted: {
      $type: Boolean,
      default: true,
    },
    subdomain: {
      $type: String,
      unique: true,
      index: true, //needed for S3 event handler
      default: null,
      immutable: true,
    },
    location: {
      $type: String,
      default: null,
    },
    versions: [
      {
        $type: mongoose.ObjectId,
        ref: 'ApplicationVersion',
      },
    ],
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

ApplicationSchema.pre('validate', function (next) {
  // always auto-generate subdomain (even isHosted is false)
  if (!this.subdomain) {
    const uid = new ShortUniqueId({
      dictionary: 'alphanum_lower',
      length: 16,
    })
    this.subdomain = uid.randomUUID()
  }
  next()
})

module.exports = {
  schema: ApplicationSchema,
  model: mongoose.model('Application', ApplicationSchema),
}
