/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2024 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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

const SignedDocumentSchema = new mongoose.Schema(
  {
    version: {
      $type: String,
      required: true,
    },
    createdAt: {
      $type: Date,
      default: Date.now(),
    },
    content: {
      $type: String,
      required: true,
    },
    type: {
      $type: String,
      enum: ['rala'],
      default: 'rala',
    },
  },
  { typeKey: '$type', timestamps: true }
)

SignedDocumentSchema.pre('validate', function (next) {
  next()
})

module.exports = {
  schema: SignedDocumentSchema,
  model: mongoose.model('SignedDocument', SignedDocumentSchema),
}
