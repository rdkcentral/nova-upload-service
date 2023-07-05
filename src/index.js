const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = process.env.NODE_PORT || 3000

// create express app
const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }))

// user paths
app.use('/v1/login', require('./routes/login'))
app.use('/v1/users', require('./routes/users'))

// http 404 error handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app
