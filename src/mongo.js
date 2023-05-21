const mongoose = require('mongoose')

const connectionString = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true
})

const outputOptions = {
  virtuals: true,
  versionKey: false,
  minimize: false,
  transform: (doc, converted) => {
    delete converted._id
  }
}

mongoose.set('toJSON', outputOptions)
mongoose.set('toObject', outputOptions)

module.exports = mongoose
