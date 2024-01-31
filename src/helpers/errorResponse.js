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

// fixme: this must be improved by checking different Mongoose error types
function send(res, message, error) {
  if (process.env.DEBUG_LOGGING === 'true') {
    console.log('====================================')
    console.log('Error response')
    console.log('====================================')
    console.log(message)
    console.log(error)
    console.log('------------------------------------')
  }

  const errorResponse = {
    status: 'error',
    message: message,
    errors: [],
  }

  if (error) {
    if (error.name && error.name == 'ValidationError') {
      for (const [key, value] of Object.entries(error.errors)) {
        if (value.kind == 'user defined' || value.kind == 'required') {
          errorResponse.errors.push(value.message)
        } else {
          const errorCode = value.kind == 'unique' ? 'Exists' : 'Invalid'
          errorResponse.errors.push(`${key}${errorCode}`)
        }
      }
    }
    if (error.name && error.name == 'Error') {
      errorResponse.errors.push(error.message)
    }
    return res.status(400).json(errorResponse)
  }

  // otherwise it must be server error
  res.sendStatus(500).json(errorResponse)
}

module.exports = {
  send,
}
