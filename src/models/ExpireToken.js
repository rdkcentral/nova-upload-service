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
    token: {
      $type: String,
      required: true,
    },
    createdAt: {
      $type: Date,
    },
    expireAt: {
      $type: Date,
      expires: 1,
    },
  },
  { typeKey: '$type', timestamps: true }
)

// generate JWT token
ExpireTokenSchema.methods.generateJWT = function () {
  const now = Math.floor(Date.now() / 1000)
  return jwt.sign(
    {
      id: this.id,
      role: this.role,
      email: this.email,
      iat: now,
      exp: now + 10 * 60, //10 minutes
      nbf: now,
    },
    process.env.JWT_SECRET_KEY
  )
}
ExpireTokenSchema.pre('validate', function (next) {
  this.token = this.generateJWT()
  const decoded = jwt.verify(this.token, process.env.JWT_SECRET_KEY)
  this.createdAt = new Date(decoded.iat * 1000)
  this.expireAt = new Date(decoded.exp * 1000)
  next()
})

ExpireTokenSchema.virtual('role')
  .set(function (role) {
    this._role = role
  })
  .get(function () {
    return this._role
  })

ExpireTokenSchema.virtual('email')
  .set(function (email) {
    this._email = email
  })
  .get(function () {
    return this._email
  })
module.exports = {
  schema: ExpireTokenSchema,
  model: mongoose.model('ExpireToken', ExpireTokenSchema),
}
