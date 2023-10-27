module.exports = (applicationVersion) => {
  applicationVersion = applicationVersion.toObject()

  return {
    version: applicationVersion.version,
    versionPath: applicationVersion.versionPath,
  }
}
