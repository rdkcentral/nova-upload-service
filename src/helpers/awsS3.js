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

require('aws-sdk/lib/maintenance_mode_message').suppress = true
const AWS = require('aws-sdk')
const fs = require('fs-extra')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
})

/**
 * Persist image to storage bucket at specified key
 * @param {String} bucket  name of the bucket
 * @param {String} key destination of file
 * @param {Buffer} body image buffer
 * @returns a promise
 */
const putObject = async (bucket, key, body) => {
  const params = { Bucket: bucket, Key: key, Body: body }
  return await s3.putObject(params).promise()
}

// putObject with file path
const putObjectWithFilePath = async (bucket, key, filePath) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: fs.createReadStream(filePath),
  }
  return await s3.putObject(params).promise()
}

const headObject = async (bucket, key) => {
  const params = { Bucket: bucket, Key: key }
  return await s3.headObject(params).promise()
}

module.exports = {
  putObject,
  putObjectWithFilePath,
  headObject,
}
