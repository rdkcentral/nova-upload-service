const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// create express app
const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }))

// user paths
app.use('/admin/login', require('./routes/login'))
app.use('/admin/users', require('./routes/users'))

// application paths
app.use('/admin/applications', require('./routes/applications'))
app.use(
  '/admin/applications/:applicationId/versions',
  require('./routes/application-versions')
)

// http 404 error handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  })
})

module.exports = app
