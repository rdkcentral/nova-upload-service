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
const errorResponse = require('../../helpers/errorResponse')

module.exports = async (req, res) => {
  try {
    if (req?.user?.role !== 'admin') {
      return res.status(403).send({
        status: 'error',
        message: `Forbidden with your role (${req?.user?.role}), only admin can create document`,
      })
    }

    const document = await SignedDocumentModel.create(req.body)
    res.status(201).json({
      data: document,
      status: 'success',
    })
  } catch (e) {
    errorResponse.send(res, 'createDocumentFailed', e)
  }
}
