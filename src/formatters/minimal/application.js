module.exports = (application) => {
  application = application.toObject()

  return {
    id: application.identifier,
    name: application.name,
    location: application.location,
  }
}
