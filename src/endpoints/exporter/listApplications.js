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

const formatters = require('../../formatters')

module.exports = async (req, res) => {
  try {
    const data = await ApplicationModel.find(
      {
        status: 'active',
      },
      {
        versions: 0,
      },
      {
        sort: { name: -1 },
      }
    )

    const formatter =
      (req.query.format && formatters[req.query.format]) || formatters.default

    res.json(
      formatter.response({
        data: data.map((app) => formatter.application(app)),
        status: 'success',
      })
    )
  } catch (e) {
    errorResponse.send(res, 'applicationList failed', e)
  }
}
