// Elastic Beanstalk works with PORT env variable
const PORT = process.env.PORT || process.env.NODE_PORT || 3000

const app = require('./app.js')

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
