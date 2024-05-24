/**
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2023 Comcast Cable Communications Management, LLC.
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

const mongoose = require('../../mongo')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
})

module.exports = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState

    const resultData = {
      dbState: dbState,
    }

    if (
      process.env.CHECK_BUCKET_STATE &&
      process.env.CHECK_BUCKET_STATE === 'true'
    )
      resultData.bucketState = await bucketStatus()

    res.status(200).json({
      data: resultData,
      status: 'success',
    })
  } catch (e) {
    res.status(500).json({
      status: 'error',
    })
  }
}
const bucketStatus = () => {
  return new Promise((resolve) => {
    try {
      s3.headBucket(
        {
          Bucket: process.env.AWS_S3_BUCKET,
        },
        async function (err) {
          if (err) resolve(false) // an error occurred
          else resolve(true) // successful response
        }
      )
    } catch (e) {
      resolve(false)
    }
  })
}
