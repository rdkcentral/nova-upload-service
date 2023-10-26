module.exports = (applicationVersion) => {
  applicationVersion = applicationVersion.toObject()

  delete applicationVersion._id
  delete applicationVersion.userId
  delete applicationVersion.status

  return applicationVersion
}
