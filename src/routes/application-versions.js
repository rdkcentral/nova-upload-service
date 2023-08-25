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
