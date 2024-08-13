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
const ExpireTokenModel = require('../../models/ExpireToken').model

module.exports = async (req, res) => {
  let { email } = req.body

  email = email ? email.toString() : ''

  const user = await UserModel.findOne({ email })

  if (user && email) {
    const token = await ExpireTokenModel.create({
      email: email,
      action: 'resetpassword',
    })

    return res.status(200).json({
      data: token,
      status: 'success',
    })
  }

  return res.status(401).json({
    status: 'error',
    message: 'invalidPasswordResetRequest',
  })
}
