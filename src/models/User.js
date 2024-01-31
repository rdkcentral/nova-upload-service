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
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongooseUniqueValidator = require('mongoose-unique-validator')
const softDelete = require('./plugins/softDelete')

// regexes
const isEmailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
const isPasswordStrong = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/

// User
const UserSchema = new mongoose.Schema(
  {
    email: {
      $type: String,
      required: true,
      unique: true,
      index: true,
      match: [isEmailRegex, 'invalidUserEmail'],
    },
    type: {
      $type: String,
      enum: ['dev', 'mvpd', 'admin'],
      default: 'dev',
    },
    password: {
      $type: String,
      required: true,
    },
    salt: String,
    status: {
      $type: String,
      default: 'ok',
    },
    lastLoginAt: {
      $type: Date,
      default: null,
    },
  },
  { typeKey: '$type', timestamps: true }
)

// unique field validator
UserSchema.plugin(mongooseUniqueValidator)

// set/generate password from clear-text pasword
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex') // generate different salt for each user
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

// check if the given password is the same with the one in the record
UserSchema.methods.isValidPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.password === hash
}

// generate JWT token
UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: parseInt(process.env.JWT_VALID_FOR) }
  )
}

UserSchema.methods.toObjectWithToken = function () {
  const user = this.toObject()
  user.token = this.generateJWT()
  user.tokenExpiresAt = new Date(
    new Date().getTime() + process.env.JWT_VALID_FOR * 1000
  ).toUTCString()
  return user
}

// check password strength
UserSchema.methods.isPasswordStrong = function () {
  return isPasswordStrong.test(this.password)
}

// automatically generate password hash if the password is modified
UserSchema.pre('validate', function (next) {
  if (this.isModified('password')) {
    if (this.isPasswordStrong()) {
      this.setPassword(this.password)
    } else {
      this.invalidate('password', 'invalidUserPassword')
    }
  }
  next()
})

// Object output transformation
UserSchema.set('toObject', {
  transform: (doc, converted) => {
    delete converted._id
    delete converted.password
    delete converted.salt
  },
})

// JSON output transformation
UserSchema.set('toObject', {
  transform: (doc, converted) => {
    delete converted._id
    delete converted.password
    delete converted.salt
    delete converted.deleted
  },
})

UserSchema.plugin(softDelete)

module.exports = {
  schema: UserSchema,
  model: mongoose.model('User', UserSchema),
}
