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
const jwt = require('jsonwebtoken')

const ExpireTokenSchema = new mongoose.Schema(
  {
    action: {
      $type: String,
      required: true,
    },
    token: {
      $type: String,
      required: true,
    },
    email: {
      $type: String,
      required: true,
    },
  },
  { typeKey: '$type', timestamps: true }
)

// generate JWT token
ExpireTokenSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this.id,
      action: this.action,
      email: this.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: 10 * 60 * 1000 }
  )
}
ExpireTokenSchema.pre('validate', function (next) {
  console.log('ExpireTokenSchema', this)
  this.token = this.generateJWT()
  next()
})
module.exports = {
  schema: ExpireTokenSchema,
  model: mongoose.model('ExpireToken', ExpireTokenSchema),
}
