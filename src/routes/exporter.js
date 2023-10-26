const router = require('express').Router({ mergeParams: true })

router.get('/', require('../endpoints/exporter/listApplications'))
router.get('/:id', require('../endpoints/exporter/getApplication'))
router.get(
  '/:applicationId/versions/:id',
  require('../endpoints/exporter/getVersion')
)

module.exports = router
