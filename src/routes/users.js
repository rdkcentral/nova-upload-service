const router = require('express').Router({ mergeParams: true })
const {authRequired} = require('../middlewares/auth')

router.post('/', require('../endpoints/users/createUser'))
router.get('/me', authRequired, require('../endpoints/users/getUserInfo'))
router.patch('/me', authRequired, require('../endpoints/users/updateUserInfo'))

module.exports = router
