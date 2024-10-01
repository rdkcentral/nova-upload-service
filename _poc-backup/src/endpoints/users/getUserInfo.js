/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC
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

module.exports = async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.user.id })
    if (!user) {
      return res.status(404).json({
        // could be 403
        status: 'error',
        message: 'not found',
      })
    }

    res.status(200).json({
      data: user.toObject(),
      status: 'success',
    })
  } catch (e) {
    res.status(500).json({
      status: 'error',
      message: 'user could not be retrieved',
    })
  }
}
