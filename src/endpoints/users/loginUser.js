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

const UserModel = require('../../models/User').model
const SignedDocumentModel = require('../../models/SignedDocument').model
const ExpireTokenModel = require('../../models/ExpireToken').model

module.exports = async (req, res) => {
  let { email, password } = req.body
  email = email ? email.toString() : ''
  password = password ? password.toString() : ''
  let token = false

  const user = await UserModel.findOne({ email })
  if (user && user.isValidPassword(password)) {
    // Check it the password is expired (90days)
    if (user.isExpired()) {
      return res.status(401).json({
        status: 'error',
        message: 'PasswordExpired',
      })
    }

    // Change token while loggedin with OTP
    const passwordObject = user.findPasswordObject(password)
    if (passwordObject && passwordObject.otp) {
      token = await ExpireTokenModel.create({
        email: email,
        role: 'resetpassword',
      })
    }

    const document = await SignedDocumentModel.findOne({ type: 'rala' }).sort({
      createdAt: -1,
    })
    const documentId =
      (user &&
        user.signedDocuments &&
        user.signedDocuments.length > 0 &&
        user.signedDocuments.at(-1).documentId) ||
      null
    const lastSignedId = (document && document.id) || null
    // Validate latest signed DocumentID
    if (!documentId || !lastSignedId || documentId !== lastSignedId) {
      return res.status(451).json({
        status: 'error',
        message: 'ralaNotSigned',
      })
    }

    try {
      // update lastlogin
      await UserModel.updateOne({ email }, { lastLoginAt: new Date() })
    } catch (err) {
      return res.sendStatus(500)
    }
    return res.status(201).json({
      data: user.toObjectWithToken(token.token),
      status: 'success',
    })
  }

  return res.status(401).json({
    status: 'error',
    message: 'invalidUserCredentials',
  })
}
