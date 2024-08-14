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

const UserModel = require('../../models/User').model
const errorResponse = require('../../helpers/errorResponse')
const ExpireTokenModel = require('../../models/ExpireToken').model

module.exports = async (req, res) => {
  console.log('reset', req.user)

  try {
    let { email, password } = req.body

    email = email ? email.toString() : ''
    password = password ? password.toString() : ''

    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'not found',
      })
    }
    if (password) {
      user.password = password
    }

    await user.save()
    const token = req.headers.authorization.split(' ').pop()
    await ExpireTokenModel.deleteOne({ token })
    res.json({
      data: user.toObject(),
      status: 'success',
    })
  } catch (e) {
    return errorResponse.send(res, 'userUpdateFailed', e)
  }
}
