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

const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const result = await ApplicationModel.findOne({
      _id: req.params.id,
      userId: req.user.id,
    })

    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found',
      })
    }

    for (const key in req.body) {
      if (key in result && result[key] !== req.body[key] && key !== 'id') {
        result.set(key, req.body[key])
      }
    }
    // result.status = 1
    await result.save()
    res.json({
      data: result.toObject(),
      status: 'success',
    })
  } catch (e) {
    console.log(e)
    errorResponse.send(res, 'updateApplication failed', e)
  }
}
