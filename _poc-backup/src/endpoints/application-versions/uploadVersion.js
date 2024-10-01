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

const ACCEPTED_MIMETYPES = [
  'application/zip',
  'application/zip-compressed',
  'application/x-zip',
  'application/x-zip-compressed',
  'multipart/x-zip',
]

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
      if (!ACCEPTED_MIMETYPES.includes(file.mimetype)) {
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
        try {
          if (error) {
            throw new Error('fileUploadFailed', { cause: error })
          }
          if (!req.file) {
            throw new Error('fileIsMissing')
          }
          if (!ACCEPTED_MIMETYPES.includes(req.file.mimetype)) {
            throw new Error('fileTypeInvalid')
          }

          // File is uploaded update application version
          applicationVersion.uploadStatus = 'pending'
          await applicationVersion.save()

          return res.status(200).json({
            data: applicationVersion.toObject(),
            status: 'success',
          })
        } catch (e) {
          return errorResponse.send(res, e.message, e)
        }
      })
    } else {
      throw new Error('Application version not found')
    }
  } catch (e) {
    return errorResponse.send(res, e.message, e)
  }
}
