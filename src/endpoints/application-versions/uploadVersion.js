const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')
const s3 = require('../../helpers/awsS3')
const fileType = require('file-type')

module.exports = async (req, res) => {
  try {
    const applicationVersion = await ApplicationVersionModel.findOne({
      applicationId: req.params.applicationId,
      _id: req.params.id,
    }).catch((e) => {
      throw new Error('applicationVersionGet failed', { cause: e })
    })

    if (applicationVersion) {
      // for consistency, we must not allow to upload if the application is not hosted
      const application = await ApplicationModel.findOne({
        _id: req.params.applicationId,
      }).catch((e) => {
        throw new Error('applicationGet failed', { cause: e })
      })
      if (!application.isHosted) {
        throw new Error('applicationNotHosted')
      }

      if (req.body.file && req.body.file.length > 0) {
        // get request body as binary and save it to S3
        const uploadedFile = Buffer.from(req.body.file, 'base64')
        const fileName = req.body.fileName.replace(/\/|\\/g, '_')
        const bucket = process.env.AWS_S3_BUCKET
        const appVersion = applicationVersion.version
        const appIdentifier = application.identifier
        const uploadDir = `uploads/${appIdentifier}/${appVersion}`
        const uploadPath = `${uploadDir}/${fileName}`
        const fileTypeResult = await fileType.fromBuffer(uploadedFile)

        if (fileTypeResult.mime !== 'application/zip') {
          throw new Error('Uploaded file is not a zip file')
        }

        try {
          await s3.putObject(bucket, uploadPath, uploadedFile)

          // file has been uploaded, update application version
          applicationVersion.uploadStatus = 'pending'
          await applicationVersion.save()

          return res.status(200).json({
            data: applicationVersion.toObject(),
            status: 'success',
          })
        } catch (e) {
          throw new Error('Application upload failed', { cause: e })
        }
      } else {
        throw new Error('File data is empty')
      }
    } else {
      throw new Error('Application version not found')
    }
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
