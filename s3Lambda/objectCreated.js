const AWS = require('aws-sdk')
const s3 = new AWS.S3({
  endpoint: process.env.AWS_ENDPOINT_URL_S3 || '', // Minio endpoint
  s3ForcePathStyle: true, // Use path-style URLs
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
const unzipper = require('unzipper')

// eslint-disable-next-line no-unused-vars
exports.handler = async function (event, context) {
  try {
    // Get the bucket and key from the S3 event
    const { bucket, object } = event.Records[0].s3
    const zipFileName = object.key.split('/').pop()

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
        const uploadParams = {
          Bucket: bucket.name,
          Key: destinationPath,
          Body: entry,
        }

        promises.push(s3.upload(uploadParams).promise())
      } else {
        entry.autodrain()
      }
    }

    await Promise.all(promises)
      .then(function () {
        console.log('Successfully extracted zip file.')
      })
      .catch(function (err) {
        console.error('Error extracting zip file:', err)
      })
  } catch (error) {
    console.error('Error:', error)
  }
}
