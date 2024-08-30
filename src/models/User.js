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
const isPasswordStrong =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?=.*[!-/:-@[-`{-~]).{16,}$/

// User
// const PasswordSchema = new mongoose.Schema({
//   _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Automatically generate _id
//   password: { type: String, required: true },
//   passwordUpdated: { type: Date, default: Date.now },
//   salt: { type: String, required: true },
// })

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
    passwordHistory: {
      $type: [Object], //Should be PasswordSchema, but it is not working
      default: [],
      required: true,
    },
    status: {
      $type: String,
      default: 'unactivated',
      enum: ['unactivated', 'inactive', 'ok'],
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
  const passwordObj = {
    salt: null,
    password: null,
    passwordUpdated: null,
  }
  passwordObj.salt = crypto.randomBytes(16).toString('hex') // generate different salt for each user
  passwordObj.password = crypto
    .pbkdf2Sync(password, passwordObj.salt, 10000, 512, 'sha512')
    .toString('hex')
  passwordObj.passwordUpdated = new Date(new Date().getTime()).toUTCString()

  this.passwordHistory.push(passwordObj)
}
UserSchema.methods.checkPasswordLength = function (password) {
  // check if password length is greater below 16.
  if (password.length < 16) {
    console.error('"Invalid Password. Password is to short"')
    return false
  }
  return true
}
UserSchema.methods.getCurrentPasswordObject = function () {
  if (this.passwordHistory && this.passwordHistory.length)
    return this.passwordHistory[this.passwordHistory.length - 1]
  else return {}
}
UserSchema.methods.isExpired = function () {
  const days = parseInt(process.env.PASSWORD_VALID_FOR)
  const expireDate = new Date(this.getCurrentPasswordObject().passwordUpdated)
  expireDate.setDate(expireDate.getDate() + days)

  // check if password is expired
  if (new Date() > expireDate) {
    console.error('Password expired')
    return true
  }
  return false
}

// check if the given password is the same with the one in the record
UserSchema.methods.isValidPassword = function (password) {
  const currPassword = this.getCurrentPasswordObject()
  var hash = crypto
    .pbkdf2Sync(password, currPassword.salt, 10000, 512, 'sha512')
    .toString('hex')
  return currPassword.password === hash
}

UserSchema.methods.isPasswordUsed = function (password) {
  return this.passwordHistory.some((item) => {
    const passwordCheck = crypto
      .pbkdf2Sync(password, item.salt, 10000, 512, 'sha512')
      .toString('hex')
    return passwordCheck === item.password
  })
}

// generate JWT token
UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      role: this.type,
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
UserSchema.methods.isPasswordStrong = function (password) {
  return isPasswordStrong.test(password)
}

// automatically generate password hash if the password is modified
UserSchema.pre('validate', function (next) {
  if (!this.password) this.invalidate('password', 'noPassword')
  else if (!this.checkPasswordLength(this.password)) {
    this.invalidate('password', 'PasswordToShort')
  } else if (!this.isPasswordStrong(this.password)) {
    this.invalidate('password', 'weakPassword')
  } else if (this.isPasswordUsed(this.password)) {
    this.invalidate('password', 'usedPassword')
  } else {
    console.log('setPassword', this.password)
    this.setPassword(this.password)
  }
  next()
})

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password
  })
  .get(function () {
    return this._password
  })

// // Object output transformation
UserSchema.set('toObject', {
  transform: (doc, converted) => {
    delete converted._id
    delete converted.passwordHistory
  },
})

// JSON output transformation
UserSchema.set('toObject', {
  transform: (doc, converted) => {
    delete converted._id
    delete converted.passwordHistory
    delete converted.deleted
  },
})

UserSchema.plugin(softDelete)

module.exports = {
  schema: UserSchema,
  model: mongoose.model('User', UserSchema),
}
