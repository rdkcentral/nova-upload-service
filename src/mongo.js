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

let connectionString = process.env.MONGODB_URL
if (!connectionString) {
  const mongodb_credentials = JSON.parse(process.env.MONGODB_CREDENTIALS)
  const mongodb_name = process.env.MONGODB_NAME
  const mongodb_host = process.env.MONGODB_HOST
  const mongodb_port = process.env.MONGODB_PORT
  const mongodb_params = process.env.MONGODB_PARAMS
  connectionString = `mongodb://${
    mongodb_credentials.username
  }:${encodeURIComponent(
    mongodb_credentials.password
  )}@${mongodb_host}:${mongodb_port}/${mongodb_name}?${mongodb_params}`
}

mongoose.set('strictQuery', false)

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  authSource: process.env.MONGODB_AUTHSOURCE,
})

const outputOptions = {
  virtuals: true,
  versionKey: false,
  minimize: false,
  transform: (doc, converted) => {
    delete converted._id
  },
}

mongoose.set('toJSON', outputOptions)
mongoose.set('toObject', outputOptions)

module.exports = mongoose
