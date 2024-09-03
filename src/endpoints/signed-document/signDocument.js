/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2024 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
const SignedDocumentModel = require('../../models/SignedDocument').model
const UserModel = require('../../models/User').model
const errorResponse = require('../../helpers/errorResponse')
const SignedUserDocumentModel = require('../../models/User').signedDocumentModel

module.exports = async (req, res) => {
  try {
    const { userId, documentId } = req.body
    const document = await SignedDocumentModel.findOne({ _id: documentId })
    const user = await UserModel.findOne({ _id: userId })
    user.signedDocuments.push({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      title: req.body.title,
      documentId: documentId
    })

    await UserModel.updateOne({_id: userId}, { signedDocuments: user.signedDocuments })
    res.status(201).json({
      status: 'success',
    })
  } catch (e) {
    errorResponse.send(res, 'signDocumentFailed', e)
  }
}
