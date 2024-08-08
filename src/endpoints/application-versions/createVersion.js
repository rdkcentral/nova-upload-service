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

const ApplicationModel = require('../../models/Application').model
const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    const application = await ApplicationModel.findOne({
      _id: req.params.applicationId,
      userId: req.user.id,
    }).catch((e) => {
      throw new Error('application not found', { cause: e })
    })

    if (application) {
      const body = {
        version: req.body.version,
        changelog: req.body.changelog,
        appIdentifier: application.identifier,
        applicationId: application._id,
        userId: req.user.id,
        uploadStatus: 'none',
      }
      const applicationVersion = await ApplicationVersionModel.create(
        body
      ).catch((e) => {
        throw new Error('applicationVersionCreate failed', { cause: e })
      })

      return res.status(201).json({
        data: applicationVersion.toObject(),
        status: 'success',
      })
    }
    return res.status(404).json({
      status: 'error',
      message: 'Application version not found',
    })
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
