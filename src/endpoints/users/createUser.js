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
const ExpireTokenModel = require('../../models/ExpireToken').model
const errorResponse = require('../../helpers/errorResponse')

const { sendEmail } = require('../../helpers/emailSender')
const activateUserHtmlTemplate = require('fs').readFileSync(
  './emailTemplate/activateUser.html',
  'utf8'
)
const activateUserTxtTemplate = require('fs').readFileSync(
  './emailTemplate/activateUser.txt',
  'utf8'
)

module.exports = async (req, res) => {
  let savedUser
  let token
  try {
    const { callbackUrl, ...user } = req.body

    savedUser = await UserModel.create(user)
    token = await ExpireTokenModel.create({
      email: savedUser.email,
      role: 'activateuser',
    })

    // url regex to validate the callback url
    const urlRegex = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )

    if (callbackUrl && !urlRegex.test(callbackUrl)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid callback url',
      })
    }

    const emailSubject = 'Nova activate your account'
    const eMailHtmlBody = activateUserHtmlTemplate
      .replace('{{URI}}', `${req.protocol}://${req.headers.host}`)
      .replace('{{EMAIL}}', savedUser.email)
      .replace('{{JWT_TOKEN}}', token.token)
    const eMailTxtBody = activateUserTxtTemplate
      .replace('{{URI}}', `${req.protocol}://${req.headers.host}`)
      .replace('{{EMAIL}}', savedUser.email)
      .replace('{{JWT_TOKEN}}', token.token)
    await sendEmail(
      [savedUser.email],
      emailSubject,
      eMailHtmlBody,
      eMailTxtBody
    )

    res.status(201).json({
      status: 'success',
    })
  } catch (e) {
    if (savedUser) await UserModel.deleteOne({ _id: savedUser._id })
    if (token) await ExpireTokenModel.deleteOne({ _id: token._id })
    errorResponse.send(res, 'userCreationFailed', e)
  }
}
