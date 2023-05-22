const router = require('express').Router({ mergeParams: true })
const {authRequired} = require('../middlewares/auth')

router.post('/', authRequired, require('../endpoints/applications/createApplication'))
router.get('/:id', authRequired, require('../endpoints/applications/getApplicationInfo'))
router.get('/', authRequired, require('../endpoints/applications/listApplications'))
router.put('/:id', authRequired, require('../endpoints/applications/updateApplication'))
router.delete('/:id', authRequired, require('../endpoints/applications/deleteApplication'))

module.exports = router
