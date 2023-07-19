const router = require('express').Router({ mergeParams: true })

router.post('/', require('../endpoints/users/loginUser'))

module.exports = router
