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

const errorResponse = require('../../helpers/errorResponse')
const ApplicationVersionModel = require('../../models/ApplicationVersion').model

module.exports = async (req, res) => {
  try {
    console.log(req.params)
    let data = await ApplicationVersionModel.find({
      applicationId: req.params.applicationId,
      userId: req.user.id,
    }).catch((e) => {
      throw new Error('applicationVersionList failed', { cause: e })
    })

    return res.status(200).json({
      data: data || [],
      status: 'success',
    })
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
