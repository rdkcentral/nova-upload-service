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

const router = require('express').Router({ mergeParams: true })
const { authRequired } = require('../middlewares/auth')
const { validateId } = require('../middlewares/validate')

router.get(
  '/',
  authRequired,
  require('../endpoints/application-versions/listVersions')
)

router.post(
  '/',
  authRequired,
  require('../endpoints/application-versions/createVersion')
)

router.get(
  '/:id',
  authRequired,
  validateId,
  require('../endpoints/application-versions/getVersion')
)

router.put(
  '/:id',
  authRequired,
  validateId,
  require('../endpoints/application-versions/updateVersion')
)

router.patch(
  '/:id/restore',
  authRequired,
  validateId,
  require('../endpoints/application-versions/restoreVersion')
)

router.delete(
  '/:id',
  authRequired,
  validateId,
  require('../endpoints/application-versions/deleteVersion')
)

router.post(
  '/:id/upload',
  authRequired,
  validateId,
  require('../endpoints/application-versions/uploadVersion')
)

module.exports = router
