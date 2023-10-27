module.exports = (applicationVersion) => {
  applicationVersion = applicationVersion.toObject()

  delete applicationVersion.id
  delete applicationVersion.userId
  delete applicationVersion.status
  delete applicationVersion.applicationId

  return applicationVersion
}
