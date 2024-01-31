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

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// create express app
const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }))

// exporter
app.use('/applications', require('./routes/exporter'))

// user paths
app.use('/admin/login', require('./routes/login'))
app.use('/admin/users', require('./routes/users'))

// application paths
app.use('/admin/applications', require('./routes/applications'))
app.use(
  '/admin/applications/:applicationId/versions',
  require('./routes/application-versions')
)

// http 404 error handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  })
})

module.exports = app
