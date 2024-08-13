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
const authRequired = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ').pop()
    let isAuthenticated = false
    let currentUser

    try {
      currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
      isAuthenticated = true
    } catch (error) {
      res.sendStatus(403)
    }

    if (isAuthenticated) {
      req.user = currentUser
      next()
    }
  } else {
    res.sendStatus(403)
  }
}

const actionAuthRequired = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ').pop()
    let isAuthenticated = false
    let reqObject

    try {
      reqObject = jwt.verify(token, process.env.JWT_SECRET_KEY)
      console.log('reqObject', reqObject)
      const dbToken = await ExpireTokenModel.findOne({
        email: reqObject.email,
        token,
      })

      if (
        dbToken &&
        reqObject.action === 'resetpassword' &&
        req.route.path === '/resetpassword'
      )
        isAuthenticated = true
    } catch (error) {
      res.sendStatus(403)
    }

    if (isAuthenticated) {
      req.obj = reqObject
      next()
    } else {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(403)
  }
}

module.exports = {
  authRequired,
  actionAuthRequired,
}
