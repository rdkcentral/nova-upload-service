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

const mongoose = require('mongoose')

// any endpoint requires path/:id must use this middleware to check
const validateId = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    next()
  } else {
    res.status(400).json({
      status: 'error',
      message: 'invalid id',
    })
  }
}

module.exports = {
  validateId,
}
