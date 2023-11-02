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
    const appIdentifier = pathParts.pop()

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
    } catch (err) {
      status = false
      console.error('Error extracting zip file:', err)
    }

    // update application version
    await updateApplicationVersion(appIdentifier, appVersion, status)
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

async function updateApplicationVersion(appIdentifier, appVersion, status) {
  try {
    const db = await connectToDatabase()
    const collection = await db.collection('applicationversions')
    const filter = { appIdentifier: appIdentifier, version: appVersion }

    // set uploadStatus to 'ready' if status=true, or 'error' if status=false
    // set versionPath to 'apps/<appIdentifier>/<appVersion>' if status=true, or '' if status=false
    const update = {
      $set: {
        uploadStatus: status ? 'ready' : 'error',
        versionPath: status ? `apps/${appIdentifier}/${appVersion}` : '',
      },
    }

    // updateOne with await
    const result = await collection.updateOne(filter, update)
    console.log(
      `${result.modifiedCount} record has been updated with uploadStatus: ${
        status ? 'ready' : 'error'
      }`
    )
  } catch (error) {
    console.error('Application version update error :', error)
  }
}
