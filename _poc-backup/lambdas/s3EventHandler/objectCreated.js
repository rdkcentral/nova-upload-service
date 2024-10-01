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

require('aws-sdk/lib/maintenance_mode_message').suppress = true
const AWS = require('aws-sdk')
const unzipper = require('unzipper')
const mime = require('mime')

// options for dev/prod
const options = {
  s3ForcePathStyle: true,
}

// dev options (if AWS_ENDPOINT_URL_S3 is set then it is dev mode because we only do that for minio)
if (process.env.AWS_ENDPOINT_URL_S3) {
  options.endpoint = process.env.AWS_ENDPOINT_URL_S3 // minio endpoint
  options.accessKeyId = process.env.AWS_ACCESS_KEY_ID
  options.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
}

const s3 = new AWS.S3(options)

// eslint-disable-next-line no-unused-vars
exports.handler = async function (event, context) {
  try {
    // Get the bucket and key from the S3 event
    const { bucket, object } = event.Records[0].s3
    const pathParts = object.key.split('/')
    const zipFileName = pathParts.pop()
    const appVersion = pathParts.pop()
    const appSubDomain = pathParts.pop()

    // Check if the object is a zip file
    if (!object.key.endsWith('.zip')) {
      console.log('Not a zip file, skipping.')
      return
    }

    // Fetch the zip file from S3
    const params = {
      Bucket: bucket.name,
      Key: object.key,
    }

    const zipFile = s3
      .getObject(params)
      .createReadStream()
      .pipe(unzipper.Parse({ forceStream: true }))

    const promises = []

    for await (const entry of zipFile) {
      const fileName = entry.path
      const destinationPath =
        object.key.replace(/^uploads/, 'apps').replace(`/${zipFileName}`, '') +
        '/' +
        fileName
      console.log(`Extracting ${fileName} to ${destinationPath}`)

      const type = entry.type
      if (type === 'File') {
        const fileMime = mime.getType(fileName) || 'application/octet-stream'
        const uploadParams = {
          Bucket: bucket.name,
          Key: destinationPath,
          Body: entry,
          ContentType: fileMime,
        }

        // upload also to latest folder
        const latestUploadParams = {
          Bucket: bucket.name,
          Key: destinationPath.replace(appVersion, 'latest'),
          Body: entry,
          ContentType: fileMime,
        }

        promises.push(s3.upload(uploadParams).promise())
        promises.push(s3.upload(latestUploadParams).promise())
      } else {
        entry.autodrain()
      }
    }

    let status = true
    try {
      await Promise.all(promises)
      console.log('Successfully extracted zip file.')

      // New code to copy the apps/<appSubDomain>/<version>/ folder to the apps/<app-identifier>/latest/ folder
      const sourcePrefix = `apps/${appSubDomain}/${appVersion}/`
      const destPrefix = `apps/${appSubDomain}/latest/`
      const listParams = {
        Bucket: bucket.name,
        Prefix: sourcePrefix,
      }
      const { Contents } = await s3.listObjectsV2(listParams).promise()
      const copyPromises = Contents.map(async (object) => {
        const copySource = `${bucket.name}/${object.Key}`
        const destKey = object.Key.replace(sourcePrefix, destPrefix)
        const copyParams = {
          CopySource: copySource,
          Bucket: bucket.name,
          Key: destKey,
        }
        return s3.copyObject(copyParams).promise()
      })
      await Promise.all(copyPromises)
      console.log('Successfully copied folder.')
    } catch (err) {
      status = false
      console.error('Error extracting zip file:', err)
    }

    // update application version
    await updateApplicationVersion(appSubDomain, appVersion, status)
  } catch (error) {
    console.error('Error:', error)
  }
}

let cachedDb = null
async function connectToDatabase() {
  const MongoClient = require('mongodb').MongoClient
  const MONGODB_URI =
    process.env.MONGODB_URL ||
    `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`

  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(MONGODB_URI)
  const db = await client.db(process.env.MONGODB_DB)

  cachedDb = db
  return db
}

async function updateApplicationVersion(appSubDomain, appVersion, status) {
  try {
    const db = await connectToDatabase()

    // get application data to obtain the application identifier
    const application = await db.collection('applications').findOne({
      subdomain: appSubDomain,
    })

    if (application) {
      const collection = await db.collection('applicationversions')
      const filter = {
        appIdentifier: application.identifier,
        version: appVersion,
      }

      const update = {
        $set: {
          uploadStatus: status ? 'ready' : 'error',
          versionPath: status ? `apps/${appSubDomain}/${appVersion}` : '',
        },
      }

      const result = await collection.updateOne(filter, update)
      console.log(
        `${result.modifiedCount} record has been updated with uploadStatus: ${
          status ? 'ready' : 'error'
        }`
      )
    } else {
      throw new Error(`Application with subdomain ${appSubDomain} not found`)
    }
  } catch (error) {
    console.error('Application version update error :', error)
  }
}
