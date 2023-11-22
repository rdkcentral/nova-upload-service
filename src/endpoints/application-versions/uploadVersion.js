const ApplicationVersionModel = require('../../models/ApplicationVersion').model
const ApplicationModel = require('../../models/Application').model
const errorResponse = require('../../helpers/errorResponse')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
})

// multer & multer-s3 setup
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    key: function (req, file, cb) {
      const appVersion = req.appVersion
      const appSubDomain = req.appSubDomain
      const uploadDir = `uploads/${appSubDomain}/${appVersion}`
      const filename = file.originalname.replace(/\/|\\/g, '_')
      const uploadPath = `${uploadDir}/${filename}`
      cb(null, uploadPath)
    },
    fileFilter: function (req, file, cb) {
      if (file.mimetype !== 'application/zip') {
        return cb(null, false)
      }
      cb(null, true)
    },
  }),
}).single('file') // 'file' is the name of the field for multipart upload

module.exports = async (req, res) => {
  try {
    const applicationVersion = await ApplicationVersionModel.findOne({
      applicationId: req.params.applicationId,
      _id: req.params.id,
      userId: req.user.id,
    }).catch((e) => {
      throw new Error('applicationVersionGet failed', { cause: e })
    })

    if (applicationVersion) {
      // for consistency, we must not allow to upload if the application is not hosted
      const application = await ApplicationModel.findOne({
        _id: req.params.applicationId,
        userId: req.user.id,
      }).catch((e) => {
        throw new Error('applicationGet failed', { cause: e })
      })
      if (!application.isHosted) {
        throw new Error('applicationNotHosted')
      }

      req.appVersion = applicationVersion.version
      req.appSubDomain = application.subdomain

      upload(req, res, async function (error) {
        if (error) {
          throw new Error('fileUploadFailed', { cause: error })
        }
        if (req.file.mimetype !== 'application/zip') {
          throw new Error('fileTypeInvalid')
        }
        if (!req.file) {
          throw new Error('fileIsMissing')
        }

        // File is uploaded update application version
        applicationVersion.uploadStatus = 'pending'
        await applicationVersion.save()

        return res.status(200).json({
          data: applicationVersion.toObject(),
          status: 'success',
        })
      })
    } else {
      throw new Error('Application version not found')
    }
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
