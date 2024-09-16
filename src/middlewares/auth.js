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

const jwt = require('jsonwebtoken')
const ExpireTokenModel = require('../models/ExpireToken').model

// any endpoint requires authentication/login must use this middleware to check
// this will be replaced as we progress because we will need different permissions of each user type
const authRequired = async (req, res, next) => {
  let isAuthenticated = false
  let decoded
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ').pop()
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      if (decoded.role) {
        if (
          (decoded.role === 'resetpassword' &&
            req.route.path === '/resetpassword') ||
          (decoded.role === 'activateuser' && req.route.path === '/')
        ) {
          const dbToken = await ExpireTokenModel.findOne({ token })
          if (dbToken) {
            isAuthenticated = true
          }
        } else if (
          decoded.role === 'admin' ||
          decoded.role === 'mvpd' ||
          decoded.role === 'dev'
        ) {
          isAuthenticated = true
        }
      }
    } catch (error) {
      isAuthenticated = false
    }
  }

  if (isAuthenticated) {
    req.user = decoded
    next()
  } else {
    res.sendStatus(403)
  }
}

module.exports = {
  authRequired,
}
