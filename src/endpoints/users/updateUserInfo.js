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
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    let { currentPassword, email, password } = req.body

    currentPassword = currentPassword ? currentPassword.toString() : ''
    email = email ? email.toString() : ''
    password = password ? password.toString() : ''

    const user = await UserModel.findOne({ _id: req.user.id })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'not found',
      })
    }

    if (!currentPassword || !user.isValidPassword(currentPassword)) {
      return res.status(400).json({
        status: 'error',
        message: 'valid current password is required',
      })
    }

    if (email) {
      user.email = email
    }
    if (password) {
      user.password = password
    }

    await user.save()
    res.json({
      data: user.toObject(),
      status: 'success',
    })
  } catch (e) {
    return errorResponse.send(res, 'userUpdateFailed', e)
  }
}
