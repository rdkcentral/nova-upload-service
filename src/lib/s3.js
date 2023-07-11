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

const putObject = async (bucket, key, body) => {
  const params = { Bucket: bucket, Key: key, Body: body }
  return await s3.putObject(params).promise()
}

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
