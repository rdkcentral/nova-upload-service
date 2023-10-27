module.exports = (application) => {
  application = application.toObject()

  delete application._id
  delete application.userId
  delete application.status

  return application
}
