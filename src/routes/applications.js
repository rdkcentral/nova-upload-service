const router = require('express').Router({ mergeParams: true })
const { authRequired } = require('../middlewares/auth')
const { validateId } = require('../middlewares/validate')

router.post(
  '/',
  authRequired,
  require('../endpoints/applications/createApplication')
)
router.get(
  '/:id',
  authRequired,
  validateId,
  require('../endpoints/applications/getApplication')
)
router.get(
  '/',
  authRequired,
  require('../endpoints/applications/listApplications')
)
router.put(
  '/:id',
  authRequired,
  validateId,
  require('../endpoints/applications/updateApplication')
)
router.delete(
  '/:id',
  authRequired,
  validateId,
  require('../endpoints/applications/deleteApplication')
)

module.exports = router
